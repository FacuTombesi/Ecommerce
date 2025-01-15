"use server"

import { db } from "@/lib/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, { message: "Missing required item"});
const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"));

// Create a schema for all the information needed from the form and set the requirements for each field
const addSchema = z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  description: z.string().min(1),
  file: fileSchema.refine(file => file.size > 0, "Missing required file"),
  image: imageSchema.refine(file => file.size > 0, "Missing required image"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries())); // Save the results parsing the entries from the form

  if (result.success === false) return result.error.formErrors.fieldErrors;

  const data = result.data;

  // Create a directory for the products files and save the path to filePath
  await fs.mkdir("products", { recursive: true })
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  // Same as files but for the images. The difference is that the directory is in the public domain
  await fs.mkdir("public/products", { recursive: true })
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

  // Create a new entry in the database with all the information from the form
  await db.product.create({ data: {
    name: data.name,
    priceInCents: data.priceInCents,
    description: data.description,
    filePath,
    imagePath,
    isAvailableForPurchase: false,
  }})

  revalidatePath("/")
  revalidatePath("/products")

  redirect("/admin/products");
}

// Create a new schema from the addSchema with the difference of making the file and the image optional
const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
})

export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) return result.error.formErrors.fieldErrors;

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } }); // Find the specific product to edit through its id

  if (product == null) return notFound();

  let filePath = product.filePath; // Save the filePath into a variable to update later
  if (data.file != null && data.file.size > 0) { // If the file changed and its size is greater than 0, proceed with the update
    await fs.unlink(product.filePath) // Unlink the previous file from the product, deleting the file from the database in the process
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`; // Update the filePath variable defined before (line 66) with the new file path
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
  }

  // Same as above but for the image (line 66-70)
  let imagePath = product.imagePath;
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${product.imagePath}`)
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
  }

  // Update the information of the specific product
  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      priceInCents: data.priceInCents,
      description: data.description,
      filePath,
      imagePath,
    }
  })

  revalidatePath("/")
  revalidatePath("/products")

  redirect("/admin/products");
}

// Create an action to toggle the isAvailableForPurchase boolean of a specific product
export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
  await db.product.update({
    where: { id },
    data: { isAvailableForPurchase }
  })

  revalidatePath("/")
  revalidatePath("/products")
}

// Create a action to delete a specific product from the database
export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });

  if (product == null) return notFound();

  // Unlink both file and image of the product from the database
  await fs.unlink(product.filePath)
  await fs.unlink(`public${product.imagePath}`)

  revalidatePath("/")
  revalidatePath("/products")
}