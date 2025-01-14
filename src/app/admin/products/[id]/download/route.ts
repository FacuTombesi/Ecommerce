import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const productFile = await db.product.findUnique({ where: { id }, select: { filePath: true, name: true } });

  if (productFile == null) return notFound();

  const { size } = await fs.stat(productFile.filePath); // Save the stats of the product filePath
  const file = await fs.readFile(productFile.filePath); // Read the product filePath information
  const extension = productFile.filePath.split(".").pop(); // Get the extension type from the filePath splitting the path at the last dot

  return new NextResponse(file, { headers: {
    "Content-Disposition": `attachment; filename="${productFile.name}.${extension}"`, // Determines the file name and its extension
    "Content-Length": size.toString(), // Tells the web browser how heavy this file is
  } });
}