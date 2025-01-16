import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(
  req: NextRequest,
  {
    params
  }: { params: { downloadVerificationId: string } }
) {
  const { downloadVerificationId } = await params;
  const downloadFile = await db.downloadVerification.findUnique({
    where: {
      id: downloadVerificationId,
      expiresAt: { gt: new Date() }
    },
    select: {
      product: { select: {
        filePath: true,
        name: true
      }}
    }
  });

  if (downloadFile == null) {
    return NextResponse.redirect(new URL("products/download/expired", req.url)); // If downloadFile is null, it means that the download file has expired and it will redirect the user to a new url
  }

  // This code below is very similar to the one used at "admin/products/[id]/download/route.ts"
  const { size } = await fs.stat(downloadFile.product.filePath);
  const file = await fs.readFile(downloadFile.product.filePath);
  const extension = downloadFile.product.filePath.split(".").pop();

  return new NextResponse(file, { headers: {
    "Content-Disposition": `attachment; filename="${downloadFile.product.name}.${extension}"`,
    "Content-Length": size.toString(),
  } });
}