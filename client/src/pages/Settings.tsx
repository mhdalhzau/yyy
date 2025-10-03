import { useState } from "react";
import { Settings as SettingsIcon, Store, User, Bell, Shield, Palette, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: "DreamsPOS",
    storeEmail: "store@dreamspos.com",
    storePhone: "+62 812-3456-7890",
    storeAddress: "Jl. Example No. 123, Jakarta",
    taxRate: "11",
    currency: "IDR",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    salesReports: true,
    newOrders: true,
  });

  const handleSaveSettings = () => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Pengaturan Disimpan",
        description: "Pengaturan berhasil diperbarui",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola pengaturan aplikasi dan toko</p>
        </div>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Toko
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Tampilan
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Toko</CardTitle>
              <CardDescription>Kelola informasi dasar toko Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Nama Toko</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    placeholder="Nama Toko"
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Email Toko</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                    placeholder="email@toko.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storePhone">Telepon</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.storePhone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                    placeholder="+62 xxx-xxxx-xxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tarif Pajak (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={storeSettings.taxRate}
                    onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: e.target.value })}
                    placeholder="11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="storeAddress">Alamat Toko</Label>
                <Input
                  id="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                  placeholder="Alamat lengkap toko"
                />
              </div>

              <div>
                <Label htmlFor="currency">Mata Uang</Label>
                <select
                  id="currency"
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="IDR">IDR - Indonesian Rupiah</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              <Button onClick={handleSaveSettings} disabled={loading} className="btn-primary">
                {loading ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Pengguna</CardTitle>
              <CardDescription>Kelola informasi profil Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input id="fullName" placeholder="Nama Lengkap" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telepon</Label>
                  <Input id="phone" placeholder="+62 xxx-xxxx-xxxx" />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value="Administrator" disabled />
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={loading} className="btn-primary">
                {loading ? "Menyimpan..." : "Update Profil"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Notifikasi</CardTitle>
              <CardDescription>Kelola preferensi notifikasi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Email</Label>
                  <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Peringatan Stok Rendah</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi ketika stok produk menipis</p>
                </div>
                <Switch
                  checked={notificationSettings.lowStockAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, lowStockAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Laporan Penjualan</Label>
                  <p className="text-sm text-muted-foreground">Terima laporan penjualan harian</p>
                </div>
                <Switch
                  checked={notificationSettings.salesReports}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, salesReports: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pesanan Baru</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi untuk setiap pesanan baru</p>
                </div>
                <Switch
                  checked={notificationSettings.newOrders}
                  onCheckedChange={(checked) => 
                    setNotificationSettings({ ...notificationSettings, newOrders: checked })
                  }
                />
              </div>

              <Button onClick={handleSaveSettings} disabled={loading} className="btn-primary">
                {loading ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan</CardTitle>
              <CardDescription>Kelola pengaturan keamanan akun</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" />
              </div>

              <div>
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" />
              </div>

              <Button onClick={handleSaveSettings} disabled={loading} className="btn-primary">
                {loading ? "Menyimpan..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tampilan</CardTitle>
              <CardDescription>Sesuaikan tampilan aplikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tema</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="border-2 border-primary rounded-lg p-4 cursor-pointer">
                    <div className="text-center">Light</div>
                  </div>
                  <div className="border-2 border-border rounded-lg p-4 cursor-pointer">
                    <div className="text-center">Dark</div>
                  </div>
                  <div className="border-2 border-border rounded-lg p-4 cursor-pointer">
                    <div className="text-center">System</div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Warna Aksen</Label>
                <div className="grid grid-cols-6 gap-4 mt-2">
                  {["blue", "green", "purple", "red", "orange", "pink"].map((color) => (
                    <div
                      key={color}
                      className={`w-full h-12 rounded-lg cursor-pointer bg-${color}-500`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={loading} className="btn-primary">
                {loading ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Kelola backup data Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-semibold">Backup Otomatis</h4>
                  <p className="text-sm text-muted-foreground">Backup harian otomatis ke cloud</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Buat Backup Sekarang
                </Button>
                <Button variant="outline" className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Restore dari Backup
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Backup Terakhir</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("id-ID", { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
