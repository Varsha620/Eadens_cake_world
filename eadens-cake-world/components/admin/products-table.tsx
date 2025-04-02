"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Plus, Save, Trash, Upload } from "lucide-react"

type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  isEditing?: boolean
  imageFile?: File
}

export default function ProductsTable() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editedProduct, setEditedProduct] = useState<Partial<Product & { imageFile?: File }>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      setProducts(data.map((product: Product) => ({ ...product, isEditing: false })))
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load products",
        variant: "destructive",
      })
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleEdit = (id: string) => {
    setProducts(prevProducts =>
      prevProducts.map(product => 
        product.id === id ? { ...product, isEditing: true } : product
      )
    )

    const productToEdit = products.find(product => product.id === id)
    if (productToEdit) {
      setEditedProduct({ ...productToEdit })
    }
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
  
      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to upload image'
      );
    }
  };

  const handleSave = async (id: string) => {
    try {
      const formData = new FormData()
      formData.append('name', editedProduct.name || '')
      formData.append('description', editedProduct.description || '')
      formData.append('price', String(editedProduct.price || 0))
      formData.append('category', editedProduct.category || '')
      formData.append('currentImage', editedProduct.image || '/placeholder.svg')
      
      if (editedProduct.imageFile) {
        formData.append('image', editedProduct.imageFile)
      }
  
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        body: formData,
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to update product")
      }
  
      const updatedProduct = await response.json()
      
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === id
            ? { ...updatedProduct, isEditing: false }
            : product
        )
      )
      
      setEditedProduct({})
      
      toast({
        title: "Product Updated",
        description: "The product has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to update product",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          errorData.error || 
          "Failed to delete product"
        );
      }
  
      // Optimistic update - remove from state immediately
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== id)
      );
  
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
  
    } catch (error) {
      console.error("Delete error:", error);
      
      // Re-fetch products to ensure sync with server
      fetchProducts();
      
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      
      reader.onload = (event) => {
        setEditedProduct(prev => ({
          ...prev,
          image: event.target?.result as string,
          imageFile: file
        }))
      }
      
      reader.readAsDataURL(file)
    }
  }

  const handleAddNew = async () => {
    try {
      setIsLoading(true);
  
      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append('name', 'New Product');
      formData.append('description', 'Product description');
      formData.append('price', '29.99');
      formData.append('category', 'other');
      // Add empty file placeholder if needed
      formData.append('image', new Blob(), 'placeholder.png');
  
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData, // No Content-Type header needed for FormData
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create product");
      }
  
      const createdProduct = await response.json();
      setProducts(prev => [...prev, { ...createdProduct, isEditing: true }]);
      setEditedProduct(createdProduct);
      
      toast({
        title: "Success",
        description: "New product created. Please update its details.",
      });
  
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-center">Loading products...</p>
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left font-medium">Image</th>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Description</th>
              <th className="px-4 py-2 text-left font-medium">Price (₹)</th>
              <th className="px-4 py-2 text-left font-medium">Category</th>
              <th className="px-4 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="px-4 py-2">
                  {product.isEditing ? (
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={editedProduct.image || product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        Change
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </Button>
                    </div>
                  ) : (
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  {product.isEditing ? (
                    <Input
                      name="name"
                      value={editedProduct.name || ""}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="px-4 py-2">
                  {product.isEditing ? (
                    <Input
                      name="description"
                      value={editedProduct.description || ""}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td className="px-4 py-2">
                  {product.isEditing ? (
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      value={editedProduct.price || ""}
                      onChange={handleChange}
                      className="w-24"
                    />
                  ) : (
                    `₹${product.price.toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-2">
                  {product.isEditing ? (
                    <Input
                      name="category"
                      value={editedProduct.category || ""}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    product.category
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  {product.isEditing ? (
                    <Button size="sm" onClick={() => handleSave(product.id)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}