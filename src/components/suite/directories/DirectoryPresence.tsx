
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Globe, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const directoryList = [
  { name: "Google Business Profile", status: "active" },
  { name: "Páginas Amarelas", status: "missing" },
  { name: "Facebook", status: "active" },
  { name: "Instagram", status: "missing" },
  { name: "Yelp", status: "active" },
  { name: "TripAdvisor", status: "missing" },
];

const DirectoryPresence = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Globe className="w-6 h-6 text-blue-600" />
        Presença em Diretórios Online
      </h1>

      <p className="text-muted-foreground max-w-2xl">
        A presença consistente da sua empresa em diretórios online aumenta a sua visibilidade e confiança no mercado. Veja abaixo em quais está presente e o que falta preencher.
      </p>

      <Card className="mt-4">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {directoryList.map((dir, i) => (
            <div
              key={i}
              className="flex items-center justify-between border p-4 rounded-xl shadow-sm bg-white"
            >
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-800">{dir.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {dir.status === "active" ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" /> Ativo
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertCircle className="w-4 h-4 mr-1" /> Em falta
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Adicionar Diretórios em Falta
        </Button>
      </div>
    </div>
  );
};

export default DirectoryPresence;
