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
import { getWarranties, createWarranty, updateWarranty, deleteWarranty } from "@/lib/api";
import { insertWarrantySchema } from "@shared/schema";
import type { Warranty } from "@shared/schema";

export default function Warranties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertWarrantySchema),
    defaultValues: {
      name: "",
      duration: 0,
      durationType: "months",
      description: "",
    },
  });

  const { data: warranties = [], isLoading } = useQuery<Warranty[]>({
    queryKey: ["/api/warranties"],
    queryFn: getWarranties,
  });

  const createWarrantyMutation = useMutation({
    mutationFn: createWarranty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/warranties"] });
      toast({
        title: "Berhasil",
        description: "Garansi berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menambahkan garansi",
        variant: "destructive",
      });
    },
  });

  const updateWarrantyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateWarranty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/warranties"] });
      toast({
        title: "Berhasil",
        description: "Garansi berhasil diperbarui",
      });
      setIsDialogOpen(false);
      setEditingWarranty(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal memperbarui garansi",
        variant: "destructive",
      });
    },
  });

  const deleteWarrantyMutation = useMutation({
    mutationFn: deleteWarranty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/warranties"] });
      toast({
        title: "Berhasil",
        description: "Garansi berhasil dihapus",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menghapus garansi",
        variant: "destructive",
      });
    },
  });

  const filteredWarranties = warranties.filter((warranty) =>
    warranty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warranty.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = form.handleSubmit((data) => {
    if (editingWarranty) {
      updateWarrantyMutation.mutate({ id: editingWarranty.id, data });
    } else {
      createWarrantyMutation.mutate(data);
    }
  });

  const handleEdit = (warranty: Warranty) => {
    setEditingWarranty(warranty);
    form.reset({
      name: warranty.name,
      duration: warranty.duration,
      durationType: warranty.durationType,
      description: warranty.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus garansi ini?")) {
      deleteWarrantyMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingWarranty(null);
    form.reset({ name: "", duration: 0, durationType: "months", description: "" });
  };

  const getDurationLabel = (duration: number, durationType: string) => {
    const typeLabels: Record<string, string> = {
      days: "Hari",
      months: "Bulan",
      years: "Tahun",
    };
    return `${duration} ${typeLabels[durationType] || durationType}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg" data-testid="text-loading">Loading warranties...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Garansi</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">Kelola garansi produk Anda</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="btn-primary"
              onClick={() => {
                setEditingWarranty(null);
                form.reset({ name: "", duration: 0, durationType: "months", description: "" });
              }}
              data-testid="button-add-warranty"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Garansi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle data-testid="text-dialog-title">
                {editingWarranty ? "Edit Garansi" : "Tambah Garansi"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Garansi</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nama garansi" 
                          {...field} 
                          data-testid="input-warranty-name"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-warranty-name" />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durasi</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            placeholder="Masukkan durasi" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                            data-testid="input-warranty-duration"
                          />
                        </FormControl>
                        <FormMessage data-testid="error-warranty-duration" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="durationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe Durasi</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-duration-type">
                              <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="days">Hari</SelectItem>
                            <SelectItem value="months">Bulan</SelectItem>
                            <SelectItem value="years">Tahun</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage data-testid="error-warranty-duration-type" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Masukkan deskripsi garansi" 
                          {...field}
                          value={field.value || ""}
                          data-testid="textarea-warranty-description"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-warranty-description" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="btn-primary"
                    disabled={createWarrantyMutation.isPending || updateWarrantyMutation.isPending}
                    data-testid="button-save-warranty"
                  >
                    {createWarrantyMutation.isPending || updateWarrantyMutation.isPending 
                      ? "Menyimpan..." 
                      : editingWarranty ? "Perbarui" : "Simpan"
                    }
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDialogClose}
                    data-testid="button-cancel-warranty"
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
          <CardTitle data-testid="text-card-title">Daftar Garansi</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari garansi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-search-warranties"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead data-testid="text-header-name">Nama Garansi</TableHead>
                <TableHead data-testid="text-header-duration">Durasi</TableHead>
                <TableHead data-testid="text-header-description">Deskripsi</TableHead>
                <TableHead data-testid="text-header-created">Tanggal Dibuat</TableHead>
                <TableHead data-testid="text-header-actions">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWarranties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground" data-testid="text-no-warranties">
                    {searchTerm ? "Tidak ada garansi yang sesuai pencarian" : "Belum ada garansi"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredWarranties.map((warranty) => (
                  <TableRow key={warranty.id} className="table-row" data-testid={`row-warranty-${warranty.id}`}>
                    <TableCell className="font-semibold" data-testid={`text-warranty-name-${warranty.id}`}>{warranty.name}</TableCell>
                    <TableCell data-testid={`text-warranty-duration-${warranty.id}`}>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                        {getDurationLabel(warranty.duration, warranty.durationType)}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-warranty-description-${warranty.id}`}>
                      {warranty.description || "Tidak ada deskripsi"}
                    </TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-warranty-created-${warranty.id}`}>
                      {new Date(warranty.createdAt!).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(warranty)}
                          data-testid={`button-edit-${warranty.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(warranty.id)}
                          disabled={deleteWarrantyMutation.isPending}
                          data-testid={`button-delete-${warranty.id}`}
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
