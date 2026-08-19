const mongoose = require('mongoose');
const QRCode = require('qrcode');
const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const cloudinary = require('../config/cloudinary');
const Room = require('../models/Room');

const generateAllRooms = async () => {
  try {
    await connectDB();
    console.log('Starting 450-Room Seeding & QR Generation...');

    // Clear existing room records if re-running
    await Room.deleteMany({});

    const blocks = ['A', 'B'];
    const roomsPerBlock = 225; // Total 450 rooms
    let count = 0;

    for (let block of blocks) {
      for (let i = 1; i <= roomsPerBlock; i++) {
        const roomNum = String(100 + i); // Generates 101, 102, ... 325

        // 1. Generate unique un-guessable token
        const rawTokenData = `${block}_${roomNum}_${process.env.ROOM_QR_SECRET || 'secret_qr_key'}`;
        const qrToken = crypto.createHash('sha256').update(rawTokenData).digest('hex');

        // 2. Generate Base64 Data URL for QR
        const qrDataUrl = await QRCode.toDataURL(qrToken);

        // 3. Upload QR image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(qrDataUrl, {
          folder: `hostel_qrs/Block_${block}`,
          public_id: `Room_${roomNum}_QR`
        });

        // 4. Save Room Record in MongoDB
        await Room.create({
          hostelBlock: block,
          roomNumber: roomNum,
          qrToken: qrToken,
          qrImageUrl: uploadResult.secure_url
        });

        count++;
        console.log(`[${count}/450] Processed Block ${block} - Room ${roomNum}`);
      }
    }

    console.log(' Successfully generated and uploaded QRs for all 450 rooms!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during room generation: ${error.message}`);
    process.exit(1);
  }
};

generateAllRooms();