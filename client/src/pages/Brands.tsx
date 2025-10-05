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
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getBrands, createBrand, updateBrand, deleteBrand } from "@/lib/api";
import { insertBrandSchema } from "@shared/schema";
import type { Brand } from "@shared/schema";

export default function Brands() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertBrandSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
    },
  });

  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
    queryFn: getBrands,
  });

  const createBrandMutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({
        title: "Berhasil",
        description: "Merek berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menambahkan merek",
        variant: "destructive",
      });
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({
        title: "Berhasil",
        description: "Merek berhasil diperbarui",
      });
      setIsDialogOpen(false);
      setEditingBrand(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal memperbarui merek",
        variant: "destructive",
      });
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({
        title: "Berhasil",
        description: "Merek berhasil dihapus",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menghapus merek",
        variant: "destructive",
      });
    },
  });

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = form.handleSubmit((data) => {
    if (editingBrand) {
      updateBrandMutation.mutate({ id: editingBrand.id, data });
    } else {
      createBrandMutation.mutate(data);
    }
  });

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    form.reset({
      name: brand.name,
      description: brand.description || "",
      logoUrl: brand.logoUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus merek ini?")) {
      deleteBrandMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingBrand(null);
    form.reset({ name: "", description: "", logoUrl: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg" data-testid="text-loading">Loading brands...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Merek</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">Kelola merek produk Anda</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="btn-primary"
              onClick={() => {
                setEditingBrand(null);
                form.reset({ name: "", description: "", logoUrl: "" });
              }}
              data-testid="button-add-brand"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Merek
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle data-testid="text-dialog-title">
                {editingBrand ? "Edit Merek" : "Tambah Merek"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Merek</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nama merek" 
                          {...field} 
                          data-testid="input-brand-name"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-brand-name" />
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
                          placeholder="Masukkan deskripsi merek" 
                          {...field}
                          value={field.value || ""}
                          data-testid="textarea-brand-description"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-brand-description" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Logo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan URL logo" 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-brand-logourl"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-brand-logourl" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="btn-primary"
                    disabled={createBrandMutation.isPending || updateBrandMutation.isPending}
                    data-testid="button-save-brand"
                  >
                    {createBrandMutation.isPending || updateBrandMutation.isPending 
                      ? "Menyimpan..." 
                      : editingBrand ? "Perbarui" : "Simpan"
                    }
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDialogClose}
                    data-testid="button-cancel-brand"
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
          <CardTitle data-testid="text-card-title">Daftar Merek</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari merek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-search-brands"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead data-testid="text-header-logo">Logo</TableHead>
                <TableHead data-testid="text-header-name">Nama Merek</TableHead>
                <TableHead data-testid="text-header-description">Deskripsi</TableHead>
                <TableHead data-testid="text-header-created">Tanggal Dibuat</TableHead>
                <TableHead data-testid="text-header-actions">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground" data-testid="text-no-brands">
                    {searchTerm ? "Tidak ada merek yang sesuai pencarian" : "Belum ada merek"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map((brand) => (
                  <TableRow key={brand.id} className="table-row" data-testid={`row-brand-${brand.id}`}>
                    <TableCell>
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-12 h-12 rounded object-contain"
                          data-testid={`img-brand-logo-${brand.id}`}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                          No Logo
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold" data-testid={`text-brand-name-${brand.id}`}>{brand.name}</TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-brand-description-${brand.id}`}>
                      {brand.description || "Tidak ada deskripsi"}
                    </TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-brand-created-${brand.id}`}>
                      {new Date(brand.createdAt!).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(brand)}
                          data-testid={`button-edit-${brand.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(brand.id)}
                          disabled={deleteBrandMutation.isPending}
                          data-testid={`button-delete-${brand.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
