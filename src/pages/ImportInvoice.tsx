
import React, { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Upload, FileText, Mail, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ImportInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileList | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Importar Notas Fiscais</h1>
            <p className="text-gray-500 mt-1">Importe notas fiscais por XML, e-mail ou integração.</p>
          </div>
        </div>

        <Tabs defaultValue="upload">
          <TabsList>
            <TabsTrigger value="upload">Upload de XML</TabsTrigger>
            <TabsTrigger value="email">Monitor de E-mail</TabsTrigger>
            <TabsTrigger value="integration">Integração</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Upload de Arquivos XML</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center ${
                    isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="p-4 bg-teal-50 rounded-full mb-4">
                    <UploadCloud className="h-8 w-8 text-teal-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Arraste e solte arquivos XML</h3>
                  <p className="text-gray-500 mb-4">ou clique para selecionar arquivos</p>
                  
                  <div className="relative">
                    <Input 
                      id="file-upload"
                      type="file"
                      accept=".xml"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivos
                    </Button>
                  </div>
                  
                  {files && (
                    <div className="mt-4 w-full">
                      <p className="text-sm font-medium text-gray-700">{files.length} arquivo(s) selecionado(s)</p>
                      <div className="mt-2 max-h-32 overflow-auto">
                        {Array.from(files).map((file, index) => (
                          <div key={index} className="flex items-center p-2 bg-gray-50 rounded mb-1">
                            <FileText className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="mt-4 w-full bg-teal-500 hover:bg-teal-600">
                        Processar {files.length} arquivo(s)
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Monitor de E-mail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">E-mail para monitoramento</Label>
                    <Input 
                      id="email" 
                      placeholder="notasfiscais@empresa.com.br" 
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="********" 
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="server">Servidor IMAP</Label>
                    <Input 
                      id="server" 
                      placeholder="imap.email.com" 
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="port">Porta</Label>
                    <Input 
                      id="port" 
                      placeholder="993" 
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center justify-center mt-6">
                    <div className="p-3 bg-orange-50 rounded-full">
                      <Mail className="h-6 w-6 text-orange-500" />
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Conectar e Monitorar E-mail
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      O sistema irá verificar novos e-mails a cada 30 minutos e importar automaticamente os XMLs anexados.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Integração com Sistemas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-teal-50 rounded-full">
                        <FileText className="h-6 w-6 text-teal-500" />
                      </div>
                    </div>
                    <h3 className="font-medium mb-2">API para Integração</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Integre seu ERP ou sistema financeiro diretamente com nossa API.
                    </p>
                    <Button variant="outline" className="w-full">
                      Documentação da API
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-orange-50 rounded-full">
                        <Upload className="h-6 w-6 text-orange-500" />
                      </div>
                    </div>
                    <h3 className="font-medium mb-2">Importação em Lote</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Importe planilhas com informações de múltiplas notas.
                    </p>
                    <Button variant="outline" className="w-full">
                      Modelo de Planilha
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-3">Integrações Disponíveis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['SAP', 'Totvs', 'Senior', 'Sankhya'].map((system) => (
                      <div key={system} className="border p-3 rounded-md text-center hover:border-teal-300 hover:bg-teal-50 cursor-pointer transition-colors">
                        <span>{system}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button className="bg-teal-500 hover:bg-teal-600">
                      Configurar Nova Integração
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ImportInvoice;
