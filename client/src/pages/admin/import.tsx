import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Download, Loader2, CheckCircle, AlertCircle, ExternalLink, Package, ArrowLeft, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  failed: number;
  source: string;
  products: Array<{
    name: string;
    price: number;
    image: string;
    status: "success" | "error" | "skipped";
    error?: string;
  }>;
}

export default function AdminImport() {
  const [url, setUrl] = useState("");
  const [maxProducts, setMaxProducts] = useState(20);
  const { toast } = useToast();

  const importMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/import-from-url", {
        url,
        maxProducts,
      });
      return response.json() as Promise<ImportResult>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Import Complete",
        description: `Imported ${data.imported} products from ${data.source}. ${data.skipped} skipped, ${data.failed} failed.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import products",
        variant: "destructive",
      });
    },
  });

  const detectSource = (inputUrl: string): string => {
    try {
      const hostname = new URL(inputUrl).hostname.toLowerCase();
      if (hostname.includes("najeeb")) return "Najeeb Pharmacy";
      if (hostname.includes("dwatson")) return "D.Watson";
      if (hostname.includes("shaheen")) return "Shaheen Chemist";
      return "Unknown Partner";
    } catch {
      return "Enter a valid URL";
    }
  };

  const detectedSource = url ? detectSource(url) : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products" data-testid="link-back-products">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold mb-1">Import Products</h1>
          <p className="text-muted-foreground">Import products from partner pharmacy websites</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Import from URL
            </CardTitle>
            <CardDescription>
              Enter the URL of any supported partner website to import products. Supported: Najeeb Pharmacy, D.Watson, Shaheen Chemist.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Partner Website URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.najeebpharmacy.com/products or https://dwatson.pk/medicines.html"
                  data-testid="input-import-url"
                />
                {url && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
              {url && detectedSource && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={detectedSource === "Enter a valid URL" ? "destructive" : "secondary"}>
                    {detectedSource}
                  </Badge>
                  {detectedSource !== "Enter a valid URL" && detectedSource !== "Unknown Partner" && (
                    <span className="text-xs text-green-600">Supported partner detected</span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxProducts">Max Products to Import</Label>
              <Input
                id="maxProducts"
                type="number"
                min={1}
                max={200}
                value={maxProducts}
                onChange={(e) => setMaxProducts(parseInt(e.target.value) || 20)}
                data-testid="input-max-products"
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of products to import (1-200)
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() => importMutation.mutate()}
              disabled={importMutation.isPending || !url || detectedSource === "Enter a valid URL"}
              data-testid="button-start-import"
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing from {detectedSource}...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Start Import
                </>
              )}
            </Button>

            {importMutation.isPending && (
              <div className="space-y-2">
                <Progress value={undefined} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Fetching products from {detectedSource}...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
            <CardDescription>
              View the results of your product import
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!importMutation.data && !importMutation.isPending && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter a URL and start an import to see results here
                </p>
              </div>
            )}

            {importMutation.data && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {importMutation.data.imported > 0 ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-semibold">Import Complete</p>
                      <p className="text-sm text-muted-foreground">
                        Source: {importMutation.data.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      {importMutation.data.imported} Imported
                    </Badge>
                    {importMutation.data.skipped > 0 && (
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                        {importMutation.data.skipped} Skipped
                      </Badge>
                    )}
                    {importMutation.data.failed > 0 && (
                      <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                        {importMutation.data.failed} Failed
                      </Badge>
                    )}
                  </div>
                </div>

                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {importMutation.data.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                        data-testid={`import-result-${index}`}
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={product.image || "https://via.placeholder.com/40"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Rs.{product.price.toLocaleString()}
                            {product.error && <span className="ml-2 text-red-500">({product.error})</span>}
                          </p>
                        </div>
                        {product.status === "success" ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : product.status === "skipped" ? (
                          <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/products" data-testid="link-view-products">
                    View All Products
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supported Partner Websites</CardTitle>
          <CardDescription>
            Click on any partner to quickly set their URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => setUrl("https://www.najeebpharmacy.com/products")}
              className="p-4 border rounded-lg hover-elevate cursor-pointer text-left"
              data-testid="button-set-najeeb-url"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Najeeb Pharmacy</p>
                  <p className="text-xs text-muted-foreground">najeebpharmacy.com</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => setUrl("https://dwatson.pk/medicines.html")}
              className="p-4 border rounded-lg hover-elevate cursor-pointer text-left"
              data-testid="button-set-dwatson-url"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">D.Watson</p>
                  <p className="text-xs text-muted-foreground">dwatson.pk</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => setUrl("https://shaheenchemistrwp.com/")}
              className="p-4 border rounded-lg hover-elevate cursor-pointer text-left"
              data-testid="button-set-shaheen-url"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Shaheen Chemist</p>
                  <p className="text-xs text-muted-foreground">shaheenchemistrwp.com</p>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Information</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground">
          <ul className="space-y-2 list-disc list-inside">
            <li>Products are imported with their name, description, price, and images</li>
            <li>Duplicate products (same name) will be skipped automatically</li>
            <li>Imported products will be set as active by default</li>
            <li>Categories are auto-detected based on product names</li>
            <li>Images are linked directly from the source website</li>
            <li>Large imports may take a few minutes to complete</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
