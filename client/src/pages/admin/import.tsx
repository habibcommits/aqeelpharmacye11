import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Download, Loader2, CheckCircle, AlertCircle, ExternalLink, Package, ArrowLeft } from "lucide-react";
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
  failed: number;
  products: Array<{
    name: string;
    price: number;
    image: string;
    status: "success" | "error";
    error?: string;
  }>;
}

export default function AdminImport() {
  const [url, setUrl] = useState("https://shaheenchemistrwp.com/");
  const [maxProducts, setMaxProducts] = useState(20);
  const { toast } = useToast();

  const importMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/import-products", {
        url,
        maxProducts,
      });
      return response.json() as Promise<ImportResult>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Import Complete",
        description: `Successfully imported ${data.imported} products. ${data.failed} failed.`,
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
          <p className="text-muted-foreground">Import products from your partner website</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Import from Partner
            </CardTitle>
            <CardDescription>
              Import products directly from Shaheen Chemist website. Products will be added to your catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Source URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://shaheenchemistrwp.com/"
                  data-testid="input-import-url"
                />
                <Button variant="outline" size="icon" asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                The partner website URL to import products from
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxProducts">Max Products</Label>
              <Input
                id="maxProducts"
                type="number"
                min={1}
                max={100}
                value={maxProducts}
                onChange={(e) => setMaxProducts(parseInt(e.target.value) || 20)}
                data-testid="input-max-products"
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of products to import (1-100)
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() => importMutation.mutate()}
              disabled={importMutation.isPending}
              data-testid="button-start-import"
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing Products...
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
                  Fetching products from partner website...
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
                  Start an import to see results here
                </p>
              </div>
            )}

            {importMutation.data && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {importMutation.data.success ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-semibold">Import Complete</p>
                      <p className="text-sm text-muted-foreground">
                        {importMutation.data.imported} imported, {importMutation.data.failed} failed
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      {importMutation.data.imported} Success
                    </Badge>
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
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Rs.{product.price.toLocaleString()}
                          </p>
                        </div>
                        {product.status === "success" ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
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
          <CardTitle>Partner Import Options</CardTitle>
          <CardDescription>
            Import products from our dedicated partner pharmacies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/admin/najeeb-import" data-testid="link-najeeb-import">
              <div className="p-4 border rounded-lg hover-elevate cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Najeeb Pharmacy</p>
                    <p className="text-xs text-muted-foreground">2774+ products available</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Import pharmaceutical products from najeebpharmacy.com
                </p>
              </div>
            </Link>
            <Link href="/admin/dwatson-import" data-testid="link-dwatson-import">
              <div className="p-4 border rounded-lg hover-elevate cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">D.Watson Pharmacy</p>
                    <p className="text-xs text-muted-foreground">6985+ medicines available</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Import medicines from dwatson.pk pharmacy
                </p>
              </div>
            </Link>
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
            <li>Duplicate products (same name) will be skipped</li>
            <li>Imported products will be set as active by default</li>
            <li>You can edit imported products after import to add categories and brands</li>
            <li>Images are linked directly from the source website</li>
            <li>Large imports may take a few minutes to complete</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
