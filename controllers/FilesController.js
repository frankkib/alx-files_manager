import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const existsAsync = promisify(fs.exists);

class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name, type, parentId = 0, isPublic = false, data,
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    const validTypes = ['folder', 'file', 'image'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    // Validate parentId
    if (parentId !== 0) {
      const parentFile = await dbClient.filesCollection.findOne({
        _id: dbClient.getObjectId(parentId),
      });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    // If it's a folder, create the folder document
    if (type === 'folder') {
      const newFolder = {
        userId,
        name,
        type,
        isPublic,
        parentId,
      };
      const result = await dbClient.filesCollection.insertOne(newFolder);
      return res.status(201).json({
        id: result.insertedId,
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    }

    // For file/image, we need to store the file locally
    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    const fileUUID = uuidv4();
    const localPath = path.join(folderPath, fileUUID);

    // Ensure the folder exists
    if (!(await existsAsync(folderPath))) {
      await mkdirAsync(folderPath, { recursive: true });
    }

    // Write the file to the local path
    const fileData = Buffer.from(data, 'base64');
    await writeFileAsync(localPath, fileData);

    // Save the file document in the DB
    const newFile = {
      userId,
      name,
      type,
      isPublic,
      parentId,
      localPath,
    };

    const result = await dbClient.filesCollection.insertOne(newFile);
    return res.status(201).json({
      id: result.insertedId,
      userId,
      name,
      type,
      isPublic,
      parentId,
      localPath,
    });
  }
}

export default FilesController;
