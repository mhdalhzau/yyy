import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getWarranties, createWarranty, updateWarranty, deleteWarranty } from "@/lib/api";
import type { Warranty } from "@shared/schema";

export default function Warranties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    durationType: "months",
    description: "",
  });
  const { toast } = useToast();

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
      setFormData({ name: "", duration: "", durationType: "months", description: "" });
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
      setFormData({ name: "", duration: "", durationType: "months", description: "" });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      duration: parseInt(formData.duration, 10),
    };
    if (editingWarranty) {
      updateWarrantyMutation.mutate({ id: editingWarranty.id, data: submitData });
    } else {
      createWarrantyMutation.mutate(submitData);
    }
  };

  const handleEdit = (warranty: Warranty) => {
    setEditingWarranty(warranty);
    setFormData({
      name: warranty.name,
      duration: warranty.duration.toString(),
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
    setFormData({ name: "", duration: "", durationType: "months", description: "" });
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
        <div className="text-lg">Loading warranties...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Garansi</h1>
          <p className="text-muted-foreground">Kelola garansi produk Anda</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary" data-testid="button-add-warranty">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Garansi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingWarranty ? "Edit Garansi" : "Tambah Garansi"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Garansi *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Masukkan nama garansi"
                  required
                  data-testid="input-warranty-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Durasi *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="Masukkan durasi"
                    required
                    data-testid="input-warranty-duration"
                  />
                </div>
                <div>
                  <Label htmlFor="durationType">Tipe Durasi *</Label>
                  <Select 
                    value={formData.durationType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, durationType: value }))}
                    required
                  >
                    <SelectTrigger data-testid="select-duration-type">
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Hari</SelectItem>
                      <SelectItem value="months">Bulan</SelectItem>
                      <SelectItem value="years">Tahun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Masukkan deskripsi garansi"
                  rows={3}
                  data-testid="textarea-warranty-description"
                />
              </div>
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
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Garansi</CardTitle>
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
                <TableHead>Nama Garansi</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWarranties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "Tidak ada garansi yang sesuai pencarian" : "Belum ada garansi"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredWarranties.map((warranty) => (
                  <TableRow key={warranty.id} className="table-row" data-testid={`row-warranty-${warranty.id}`}>
                    <TableCell className="font-semibold">{warranty.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                        {getDurationLabel(warranty.duration, warranty.durationType)}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {warranty.description || "Tidak ada deskripsi"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
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
