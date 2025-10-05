import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getVariantAttributes, createVariantAttribute, updateVariantAttribute, deleteVariantAttribute } from "@/lib/api";
import { insertVariantAttributeSchema } from "@shared/schema";
import type { VariantAttribute } from "@shared/schema";
import { TagsInput } from "react-tag-input-component";

export default function VariantAttributes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<VariantAttribute | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertVariantAttributeSchema),
    defaultValues: {
      name: "",
      values: [] as string[],
    },
  });

  const { data: attributes = [], isLoading } = useQuery<VariantAttribute[]>({
    queryKey: ["/api/variant-attributes"],
    queryFn: getVariantAttributes,
  });

  const createAttributeMutation = useMutation({
    mutationFn: createVariantAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/variant-attributes"] });
      toast({
        title: "Berhasil",
        description: "Atribut varian berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menambahkan atribut varian",
        variant: "destructive",
      });
    },
  });

  const updateAttributeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateVariantAttribute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/variant-attributes"] });
      toast({
        title: "Berhasil",
        description: "Atribut varian berhasil diperbarui",
      });
      setIsDialogOpen(false);
      setEditingAttribute(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal memperbarui atribut varian",
        variant: "destructive",
      });
    },
  });

  const deleteAttributeMutation = useMutation({
    mutationFn: deleteVariantAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/variant-attributes"] });
      toast({
        title: "Berhasil",
        description: "Atribut varian berhasil dihapus",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menghapus atribut varian",
        variant: "destructive",
      });
    },
  });

  const filteredAttributes = attributes.filter((attr) =>
    attr.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = form.handleSubmit((data) => {
    if (editingAttribute) {
      updateAttributeMutation.mutate({ id: editingAttribute.id, data });
    } else {
      createAttributeMutation.mutate(data);
    }
  });

  const handleEdit = (attribute: VariantAttribute) => {
    setEditingAttribute(attribute);
    form.reset({
      name: attribute.name,
      values: attribute.values || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus atribut varian ini?")) {
      deleteAttributeMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingAttribute(null);
    form.reset({ name: "", values: [] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg" data-testid="text-loading">Loading variant attributes...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Atribut Varian</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">Kelola atribut varian produk seperti ukuran, warna, dll</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="btn-primary"
              onClick={() => {
                setEditingAttribute(null);
                form.reset({ name: "", values: [] });
              }}
              data-testid="button-add-attribute"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Atribut
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle data-testid="text-dialog-title">
                {editingAttribute ? "Edit Atribut Varian" : "Tambah Atribut Varian"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Atribut</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nama atribut (misal: Ukuran, Warna)" 
                          {...field} 
                          data-testid="input-attribute-name"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-attribute-name" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="values"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nilai Atribut</FormLabel>
                      <FormControl>
                        <div className="mt-2" data-testid="tags-input-values">
                          <TagsInput
                            value={field.value || []}
                            onChange={field.onChange}
                            name="values"
                            placeHolder="Ketik nilai dan tekan Enter"
                          />
                        </div>
                      </FormControl>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ketik nilai dan tekan Enter untuk menambahkan. Contoh: S, M, L, XL
                      </p>
                      <FormMessage data-testid="error-attribute-values" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="btn-primary"
                    disabled={createAttributeMutation.isPending || updateAttributeMutation.isPending}
                    data-testid="button-save-attribute"
                  >
                    {createAttributeMutation.isPending || updateAttributeMutation.isPending 
                      ? "Menyimpan..." 
                      : editingAttribute ? "Perbarui" : "Simpan"
                    }
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDialogClose}
                    data-testid="button-cancel-attribute"
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
          <CardTitle data-testid="text-card-title">Daftar Atribut Varian</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari atribut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-search-attributes"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead data-testid="text-header-name">Nama Atribut</TableHead>
                <TableHead data-testid="text-header-values">Nilai</TableHead>
                <TableHead data-testid="text-header-created">Tanggal Dibuat</TableHead>
                <TableHead data-testid="text-header-actions">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttributes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground" data-testid="text-no-attributes">
                    {searchTerm ? "Tidak ada atribut yang sesuai pencarian" : "Belum ada atribut varian"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttributes.map((attribute) => (
                  <TableRow key={attribute.id} className="table-row" data-testid={`row-attribute-${attribute.id}`}>
                    <TableCell className="font-semibold" data-testid={`text-attribute-name-${attribute.id}`}>{attribute.name}</TableCell>
                    <TableCell data-testid={`text-attribute-values-${attribute.id}`}>
                      <div className="flex flex-wrap gap-2">
                        {attribute.values && attribute.values.length > 0 ? (
                          attribute.values.map((value, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                              data-testid={`tag-value-${index}`}
                            >
                              {value}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">Tidak ada nilai</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-attribute-created-${attribute.id}`}>
                      {new Date(attribute.createdAt!).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(attribute)}
                          data-testid={`button-edit-${attribute.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(attribute.id)}
                          disabled={deleteAttributeMutation.isPending}
                          data-testid={`button-delete-${attribute.id}`}
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
