import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockData = [
  { month: "Jan", sales: 32000, purchases: 25000 },
  { month: "Feb", sales: 48000, purchases: 35000 },
  { month: "Mar", sales: 40000, purchases: 30000 },
  { month: "Apr", sales: 56000, purchases: 42000 },
  { month: "Mei", sales: 44000, purchases: 35000 },
  { month: "Jun", sales: 52000, purchases: 40000 },
];

const periods = [
  { label: "1H", value: "1day" },
  { label: "1M", value: "1week" },
  { label: "3M", value: "1month" },
  { label: "6M", value: "3months" },
  { label: "1T", value: "1year" },
];

export default function SalesChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("1day");

  const maxValue = Math.max(...mockData.map(d => Math.max(d.sales, d.purchases)));

  return (
    <Card className="lg:col-span-2" data-testid="card-sales-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Penjualan & Pembelian
          </CardTitle>
          <div className="flex gap-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
                className="px-3 py-1 text-xs"
                data-testid={`button-period-${period.label.toLowerCase()}`}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex gap-6 mb-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Pembelian</p>
            <p className="text-2xl font-bold text-foreground" data-testid="text-total-purchases">3K</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Penjualan</p>
            <p className="text-2xl font-bold text-foreground" data-testid="text-total-sales">1K</p>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-around gap-2" data-testid="chart-sales-purchases">
          {mockData.map((item, index) => (
            <div key={item.month} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full flex flex-col gap-1">
                <div 
                  className="w-full bg-primary rounded-t" 
                  style={{ height: `${(item.sales / maxValue) * 200}px` }}
                  title={`Penjualan: ${item.sales.toLocaleString()}`}
                ></div>
                <div 
                  className="w-full bg-secondary rounded-t" 
                  style={{ height: `${(item.purchases / maxValue) * 200}px` }}
                  title={`Pembelian: ${item.purchases.toLocaleString()}`}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground">{item.month}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
