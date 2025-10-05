import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory, getCategories } from "@/lib/api";
import { insertSubCategorySchema } from "@shared/schema";
import type { SubCategory, Category } from "@shared/schema";

export default function SubCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertSubCategorySchema),
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
    },
  });

  const { data: subCategories = [], isLoading } = useQuery<SubCategory[]>({
    queryKey: ["/api/sub-categories"],
    queryFn: getSubCategories,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getCategories,
  });

  const createSubCategoryMutation = useMutation({
    mutationFn: createSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sub-categories"] });
      toast({
        title: "Berhasil",
        description: "Sub-kategori berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menambahkan sub-kategori",
        variant: "destructive",
      });
    },
  });

  const updateSubCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateSubCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sub-categories"] });
      toast({
        title: "Berhasil",
        description: "Sub-kategori berhasil diperbarui",
      });
      setIsDialogOpen(false);
      setEditingSubCategory(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal memperbarui sub-kategori",
        variant: "destructive",
      });
    },
  });

  const deleteSubCategoryMutation = useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sub-categories"] });
      toast({
        title: "Berhasil",
        description: "Sub-kategori berhasil dihapus",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menghapus sub-kategori",
        variant: "destructive",
      });
    },
  });

  const filteredSubCategories = subCategories.filter((subCat) =>
    subCat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subCat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = form.handleSubmit((data) => {
    if (editingSubCategory) {
      updateSubCategoryMutation.mutate({ id: editingSubCategory.id, data });
    } else {
      createSubCategoryMutation.mutate(data);
    }
  });

  const handleEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    form.reset({
      name: subCategory.name,
      categoryId: subCategory.categoryId,
      description: subCategory.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus sub-kategori ini?")) {
      deleteSubCategoryMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingSubCategory(null);
    form.reset({ name: "", categoryId: "", description: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg" data-testid="text-loading">Loading sub-categories...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Sub-Kategori</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">Kelola sub-kategori produk Anda</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="btn-primary"
              onClick={() => {
                setEditingSubCategory(null);
                form.reset({ name: "", categoryId: "", description: "" });
              }}
              data-testid="button-add-subcategory"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Sub-Kategori
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle data-testid="text-dialog-title">
                {editingSubCategory ? "Edit Sub-Kategori" : "Tambah Sub-Kategori"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Sub-Kategori</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nama sub-kategori" 
                          {...field} 
                          data-testid="input-subcategory-name"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-subcategory-name" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Induk</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Pilih kategori induk" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage data-testid="error-subcategory-category" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Masukkan deskripsi sub-kategori" 
                          {...field}
                          value={field.value || ""}
                          data-testid="textarea-subcategory-description"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-subcategory-description" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="btn-primary"
                    disabled={createSubCategoryMutation.isPending || updateSubCategoryMutation.isPending}
                    data-testid="button-save-subcategory"
                  >
                    {createSubCategoryMutation.isPending || updateSubCategoryMutation.isPending 
                      ? "Menyimpan..." 
                      : editingSubCategory ? "Perbarui" : "Simpan"
                    }
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDialogClose}
                    data-testid="button-cancel-subcategory"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle data-testid="text-card-title">Daftar Sub-Kategori</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari sub-kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-search-subcategories"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead data-testid="text-header-name">Nama Sub-Kategori</TableHead>
                <TableHead data-testid="text-header-category">Kategori Induk</TableHead>
                <TableHead data-testid="text-header-description">Deskripsi</TableHead>
                <TableHead data-testid="text-header-created">Tanggal Dibuat</TableHead>
                <TableHead data-testid="text-header-actions">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground" data-testid="text-no-subcategories">
                    {searchTerm ? "Tidak ada sub-kategori yang sesuai pencarian" : "Belum ada sub-kategori"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubCategories.map((subCategory) => {
                  const parentCategory = categories.find(cat => cat.id === subCategory.categoryId);
                  return (
                    <TableRow key={subCategory.id} className="table-row" data-testid={`row-subcategory-${subCategory.id}`}>
                      <TableCell className="font-semibold" data-testid={`text-subcategory-name-${subCategory.id}`}>{subCategory.name}</TableCell>
                      <TableCell data-testid={`text-subcategory-category-${subCategory.id}`}>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                          {parentCategory?.name || "Tidak ditemukan"}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground" data-testid={`text-subcategory-description-${subCategory.id}`}>
                        {subCategory.description || "Tidak ada deskripsi"}
                      </TableCell>
                      <TableCell className="text-muted-foreground" data-testid={`text-subcategory-created-${subCategory.id}`}>
                        {new Date(subCategory.createdAt!).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(subCategory)}
                            data-testid={`button-edit-${subCategory.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(subCategory.id)}
                            disabled={deleteSubCategoryMutation.isPending}
                            data-testid={`button-delete-${subCategory.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
