import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://solankiish25:1234@cluster0.hvuwzyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'test';

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  isConnected = true;
}

const gallerySchema = new mongoose.Schema({
  url: String, // for backward compatibility or external images
  data: String, // base64 image data
  name: String,
}, { _id: false });

const videoSchema = new mongoose.Schema({
  url: String,
  name: String,
}, { _id: false });

const propertySchema = new mongoose.Schema({
  name: String,
  tagline: String,
  propertyType: String,
  location: String, // area
  priceRange: String,
  builder: {
    developerName: String,
    websiteUrl: String,
  },
  keyHighlights: {
    reraApproved: Boolean,
    possessionDate: String,
    unitConfiguration: String,
    carpetArea: String,
    otherAmenities: [String],
    igbcGoldCertified: Boolean,
  },
  gallery: [gallerySchema],
  videos: [videoSchema],
  locationAdvantage: {
    addressUrl: String,
    advantages: [String],
  },
  featuredDevelopment: {
    text: String,
    images: [String],
  },
  otherProjects: [String],
  trendingScore: Number,
  featured: Boolean,
  status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema, 'properties');

export async function GET() {
  try {
    await connectDB();
    const properties = await Property.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, properties });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const property = await Property.create(data);
    return NextResponse.json({ success: true, property });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    if (!data._id) return NextResponse.json({ success: false, message: 'Missing property ID' }, { status: 400 });
    const property = await Property.findByIdAndUpdate(data._id, { ...data, updatedAt: new Date() }, { new: true });
    return NextResponse.json({ success: true, property });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { _id } = await req.json();
    if (!_id) return NextResponse.json({ success: false, message: 'Missing property ID' }, { status: 400 });
    await Property.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 