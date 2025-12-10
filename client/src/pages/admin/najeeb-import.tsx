import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Download, Loader2, CheckCircle, AlertCircle, ExternalLink, Package, ArrowLeft, Store, RefreshCw } from "lucide-react";
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
  skipped: number;
  products: Array<{
    name: string;
    price: number;
    image: string;
    status: "success" | "error" | "skipped";
    error?: string;
  }>;
}

export default function AdminNajeebImport() {
  const [maxProducts, setMaxProducts] = useState(50);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const importMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/import-najeeb", {
        maxProducts,
        page,
      });
      return response.json() as Promise<ImportResult>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Import Complete",
        description: `Successfully imported ${data.imported} products from Najeeb Pharmacy.`,
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
          <h1 className="text-2xl font-bold mb-1">Import from Najeeb Pharmacy</h1>
          <p className="text-muted-foreground">Import products from your partner Najeeb Pharmacy</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Najeeb Pharmacy Import
            </CardTitle>
            <CardDescription>
              Import pharmaceutical products directly from{" "}
              <a 
                href="https://www.najeebpharmacy.com/products" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                najeebpharmacy.com
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Store className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold">Partner Website</p>
                  <p className="text-sm text-muted-foreground">najeebpharmacy.com - 2774+ products</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full" data-testid="link-najeeb-website">
                <a href="https://www.najeebpharmacy.com/products" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Partner Products
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxProducts">Products to Import</Label>
                <Input
                  id="maxProducts"
                  type="number"
                  min={1}
                  max={200}
                  value={maxProducts}
                  onChange={(e) => setMaxProducts(parseInt(e.target.value) || 50)}
                  data-testid="input-max-products"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page">Start Page</Label>
                <Input
                  id="page"
                  type="number"
                  min={1}
                  max={232}
                  value={page}
                  onChange={(e) => setPage(parseInt(e.target.value) || 1)}
                  data-testid="input-page"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Import products from Najeeb Pharmacy. Each page contains 12 products. Total 232 pages available.
            </p>

            <Button
              className="w-full"
              onClick={() => importMutation.mutate()}
              disabled={importMutation.isPending}
              data-testid="button-start-najeeb-import"
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing from Najeeb Pharmacy...
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
                  Fetching products from Najeeb Pharmacy...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
            <CardDescription>
              View the results of your Najeeb Pharmacy import
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
                        {importMutation.data.imported} imported, {importMutation.data.skipped} skipped
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      {importMutation.data.imported} Success
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
                        ) : product.status === "skipped" ? (
                          <RefreshCw className="w-4 h-4 text-yellow-500 flex-shrink-0" />
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
          <CardTitle>Import Information</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground">
          <ul className="space-y-2 list-disc list-inside">
            <li>Products are imported from Najeeb Pharmacy with name, price, and images</li>
            <li>Duplicate products (same name) will be automatically skipped</li>
            <li>Imported products are set as active by default with 20 units in stock</li>
            <li>You can edit imported products to add categories and brands</li>
            <li>Images are linked directly from the Najeeb Pharmacy website</li>
            <li>Large imports may take a few minutes to complete</li>
            <li>Category will be auto-detected based on product name when possible</li>
          </ul>
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-2">Note:</p>
            <p className="text-xs">
              If import returns 0 products, the website may have updated their structure. 
              You can alternatively use the general Import page with shaheenchemistrwp.com 
              which has similar pharmaceutical products.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
