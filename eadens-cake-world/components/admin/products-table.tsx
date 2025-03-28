"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Plus, Save, Trash } from "lucide-react"

type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  isEditing?: boolean
}

export default function ProductsTable() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({})

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      
      if (!response.ok) {
        let errorMessage = "Failed to fetch products"
        try {
          const errorData = await response.text()
          if (errorData) {
            const parsedError = JSON.parse(errorData)
            errorMessage = parsedError.error || errorMessage
          }
        } catch (e) {
          console.error("Error parsing error response:", e)
        }
        throw new Error(errorMessage)
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
      setProducts([]) // Clear products on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleEdit = (id: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === id ? { ...product, isEditing: true } : product)),
    )

    const productToEdit = products.find((product) => product.id === id)
    if (productToEdit) {
      setEditedProduct({ ...productToEdit })
    }
  }

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedProduct.name,
          description: editedProduct.description,
          price: typeof editedProduct.price === "string" ? Number.parseFloat(editedProduct.price) : editedProduct.price,
          category: editedProduct.category,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update product")
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? {
                ...product,
                ...editedProduct,
                isEditing: false,
                price:
                  typeof editedProduct.price === "string"
                    ? Number.parseFloat(editedProduct.price)
                    : editedProduct.price || product.price,
              }
            : product,
        ),
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
        description: "Failed to update product",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))

      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully.",
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddNew = async () => {
    try {
      const newProduct = {
        name: "New Product",
        description: "Product description",
        price: 29.99,
        category: "other",
        image: "/placeholder.svg?height=100&width=100",
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      const createdProduct = await response.json()

      setProducts((prevProducts) => [...prevProducts, { ...createdProduct, isEditing: true }])

      setEditedProduct(createdProduct)

      toast({
        title: "New Product Added",
        description: "Edit the details of the new product.",
      })
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      })
    }
  }

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
              <th className="px-4 py-2 text-left font-medium">Price</th>
              <th className="px-4 py-2 text-left font-medium">Category</th>
              <th className="px-4 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="px-4 py-2">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                </td>
                <td className="px-4 py-2">
                  {product.isEditing ? (
                    <Input name="name" value={editedProduct.name || ""} onChange={handleChange} className="w-full" />
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
                    `$${product.price.toFixed(2)}`
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
                <td className="px-4 py-2">
                  {product.isEditing ? (
                    <Button size="sm" variant="outline" className="mr-2 gap-1" onClick={() => handleSave(product.id)}>
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="mr-2 gap-1" onClick={() => handleEdit(product.id)}>
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-red-500"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash className="h-4 w-4" />
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
