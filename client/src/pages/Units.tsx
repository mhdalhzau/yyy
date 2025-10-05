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
import { getUnits, createUnit, updateUnit, deleteUnit } from "@/lib/api";
import { insertUnitSchema } from "@shared/schema";
import type { Unit } from "@shared/schema";

export default function Units() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertUnitSchema),
    defaultValues: {
      name: "",
      shortName: "",
    },
  });

  const { data: units = [], isLoading } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
    queryFn: getUnits,
  });

  const createUnitMutation = useMutation({
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/units"] });
      toast({
        title: "Berhasil",
        description: "Unit berhasil ditambahkan",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menambahkan unit",
        variant: "destructive",
      });
    },
  });

  const updateUnitMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUnit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/units"] });
      toast({
        title: "Berhasil",
        description: "Unit berhasil diperbarui",
      });
      setIsDialogOpen(false);
      setEditingUnit(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal memperbarui unit",
        variant: "destructive",
      });
    },
  });

  const deleteUnitMutation = useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/units"] });
      toast({
        title: "Berhasil",
        description: "Unit berhasil dihapus",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menghapus unit",
        variant: "destructive",
      });
    },
  });

  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = form.handleSubmit((data) => {
    if (editingUnit) {
      updateUnitMutation.mutate({ id: editingUnit.id, data });
    } else {
      createUnitMutation.mutate(data);
    }
  });

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    form.reset({
      name: unit.name,
      shortName: unit.shortName,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus unit ini?")) {
      deleteUnitMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingUnit(null);
    form.reset({ name: "", shortName: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg" data-testid="text-loading">Loading units...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Unit</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">Kelola unit pengukuran produk</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="btn-primary"
              onClick={() => {
                setEditingUnit(null);
                form.reset({ name: "", shortName: "" });
              }}
              data-testid="button-add-unit"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle data-testid="text-dialog-title">
                {editingUnit ? "Edit Unit" : "Tambah Unit"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Unit</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nama unit (misal: Kilogram)" 
                          {...field} 
                          data-testid="input-unit-name"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-unit-name" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Pendek</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nama pendek (misal: Kg)" 
                          {...field} 
                          data-testid="input-unit-shortname"
                        />
                      </FormControl>
                      <FormMessage data-testid="error-unit-shortname" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="btn-primary"
                    disabled={createUnitMutation.isPending || updateUnitMutation.isPending}
                    data-testid="button-save-unit"
                  >
                    {createUnitMutation.isPending || updateUnitMutation.isPending 
                      ? "Menyimpan..." 
                      : editingUnit ? "Perbarui" : "Simpan"
                    }
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDialogClose}
                    data-testid="button-cancel-unit"
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
          <CardTitle data-testid="text-card-title">Daftar Unit</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-search-units"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead data-testid="text-header-name">Nama Unit</TableHead>
                <TableHead data-testid="text-header-shortname">Nama Pendek</TableHead>
                <TableHead data-testid="text-header-created">Tanggal Dibuat</TableHead>
                <TableHead data-testid="text-header-actions">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground" data-testid="text-no-units">
                    {searchTerm ? "Tidak ada unit yang sesuai pencarian" : "Belum ada unit"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((unit) => (
                  <TableRow key={unit.id} className="table-row" data-testid={`row-unit-${unit.id}`}>
                    <TableCell className="font-semibold" data-testid={`text-unit-name-${unit.id}`}>{unit.name}</TableCell>
                    <TableCell data-testid={`text-unit-shortname-${unit.id}`}>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                        {unit.shortName}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-unit-created-${unit.id}`}>
                      {new Date(unit.createdAt!).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(unit)}
                          data-testid={`button-edit-${unit.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(unit.id)}
                          disabled={deleteUnitMutation.isPending}
                          data-testid={`button-delete-${unit.id}`}
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
