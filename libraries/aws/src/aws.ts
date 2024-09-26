import {
  S3Client,
  S3ClientConfig,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import {SESClient, SendEmailCommand} from '@aws-sdk/client-ses';
import {Upload} from '@aws-sdk/lib-storage';
import {sendSMS} from './sms';

let s3: S3Client, ses: SESClient;

export {
  s3,
  ses,
  SendEmailCommand,
  Upload,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  PutObjectCommand,
  sendSMS,
};

/* AWS.config.update({
    region: 'eu-central-1',
    httpOptions: {agent: new https.Agent({rejectUnauthorized: false})},
  }); */

const config: S3ClientConfig = {
  credentials: {
    accessKeyId: Bun.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: Bun.env.S3_ACCESS_SECRET_KEY!,
  },
  region: Bun.env.AWS_DEF_REGION,
};

// endpoint & s3ForcePathStyle are only required for local development with localstack
if (Bun.env.S3_ENDPOINT_URL) {
  config.endpoint = Bun.env.S3_ENDPOINT_URL;
}
if (Bun.env.S3_FORCE_PATH_STYLE) {
  config.forcePathStyle = Bun.env.S3_FORCE_PATH_STYLE === 'true';
}

s3 = new S3Client(config); // new S3(config);

ses = new SESClient({
  region: Bun.env.SES_REGION,
  credentials: {
    accessKeyId: Bun.env.SES_ACCESS_KEY_ID!,
    secretAccessKey: Bun.env.SES_ACCESS_SECRET_KEY!,
  },
});
