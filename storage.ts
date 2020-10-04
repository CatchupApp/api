require('dotenv').config() 

import admin from 'firebase-admin'
import * as serviceAccount from "./config.json"
import * as fs from 'fs';

const BUCKET_URL = process.env.GCLOUD_STORAGE_BUCKET_URL as string;

// Just put that json into an object that works with ts :P
const adminParams = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url
}

admin.initializeApp({
  credential: admin.credential.cert(adminParams),
  storageBucket: BUCKET_URL
})

const bucket = admin.storage().bucket();

// Nice little interface representing MulterFiles
export interface MulterFile {
  key: string,
  path: string,
  mimetype: string,
  originalname: string,
  size: number
}

/**
 * Uploads a given file to gcloud.
 * @param file A MulterFile describing a file to be uploaded.
 */
async function uploadFile(file: MulterFile) {
  return new Promise((resolve, reject) => {
    var blob = bucket.file(file.originalname);
    var blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => reject(err));
    blobStream.on('finish', resolve);

    fs.createReadStream(file.path).pipe(blobStream);
  })
}

/**
 * Downloads a file from google cloud storage to a given destination.
 * @param sourceFilename String representing the file being downloaded remotely (such as "file.txt").
 * @param destFilename String representing the destination path of the download (such as "./file.txt").
 */
async function downloadFile(sourceFilename: string, destFilename: string) {
  const options = {
    destination: destFilename
  }

  await bucket.file(sourceFilename).download(options);
}