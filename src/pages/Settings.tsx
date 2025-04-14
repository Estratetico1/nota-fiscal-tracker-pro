
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { 
  UserCog, 
  Mail, 
  Settings as SettingsIcon, 
  Save, 
  AlertTriangle, 
  Shield, 
  Timer 
} from "lucide-react";

const Settings = () => {
  // Email settings form
  const [emailSettings, setEmailSettings] = React.useState({
    senderName: "Três Pharma",
    senderEmail: "financeiro@trespharma.com.br",
    smtpServer: "smtp.trespharma.com.br",
    smtpPort: "587",
    username: "financeiro@trespharma.com.br",
    password: "********",
    useSSL: true,
    sendAuto: true,
    sendDays: "3",
    overdueTemplate: "Prezado cliente,\n\nIdentificamos que a fatura {invoice} no valor de {value} encontra-se vencida desde {dueDate}.\n\nSolicitamos a regularização do pagamento o mais breve possível.\n\nAtenciosamente,\nEquipe Três Pharma"
  });

  // Access types form
  const [accessTypes, setAccessTypes] = React.useState([
    { id: 1, name: "Administrador", description: "Acesso total ao sistema", permissions: ["view", "edit", "delete", "admin"] },
    { id: 2, name: "Financeiro", description: "Acesso ao módulo financeiro", permissions: ["view", "edit"] },
    { id: 3, name: "Logística", description: "Acesso ao módulo de entregas", permissions: ["view", "edit"] },
    { id: 4, name: "Cliente", description: "Acesso limitado às suas próprias notas fiscais", permissions: ["view"] }
  ]);

  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSaveEmailSettings = () => {
    // In a real app, this would send the settings to an API
    toast.success("Configurações de e-mail salvas com sucesso!");
  };

  const handleSaveAccessTypes = () => {
    // In a real app, this would send the settings to an API
    toast.success("Tipos de acesso salvos com sucesso!");
  };

  const testEmailConnection = () => {
    toast.success("Conexão SMTP testada com sucesso!");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Configurações</h1>

        <Tabs defaultValue="email">
          <TabsList className="mb-4">
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Configuração de E-mail
            </TabsTrigger>
            <TabsTrigger value="access">
              <Shield className="h-4 w-4 mr-2" />
              Tipos de Acesso
            </TabsTrigger>
            <TabsTrigger value="general">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de E-mail</CardTitle>
                <CardDescription>
                  Configure as opções para envio automatizado de e-mails de cobrança e notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Nome do Remetente</Label>
                    <Input 
                      id="senderName" 
                      name="senderName"
                      value={emailSettings.senderName} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">E-mail do Remetente</Label>
                    <Input 
                      id="senderEmail" 
                      name="senderEmail"
                      value={emailSettings.senderEmail} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">Servidor SMTP</Label>
                    <Input 
                      id="smtpServer" 
                      name="smtpServer"
                      value={emailSettings.smtpServer} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Porta SMTP</Label>
                    <Input 
                      id="smtpPort" 
                      name="smtpPort"
                      value={emailSettings.smtpPort} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário</Label>
                    <Input 
                      id="username" 
                      name="username"
                      value={emailSettings.username} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      name="password"
                      type="password"
                      value={emailSettings.password} 
                      onChange={handleEmailSettingsChange} 
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="useSSL" 
                    name="useSSL"
                    checked={emailSettings.useSSL}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, useSSL: checked }))} 
                  />
                  <Label htmlFor="useSSL">Usar conexão segura (SSL/TLS)</Label>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Cobrança Automática</h3>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch 
                      id="sendAuto" 
                      name="sendAuto"
                      checked={emailSettings.sendAuto}
                      onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, sendAuto: checked }))} 
                    />
                    <Label htmlFor="sendAuto">Enviar cobranças automaticamente</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sendDays">
                        Enviar após quantos dias de vencimento
                      </Label>
                      <Input 
                        id="sendDays" 
                        name="sendDays"
                        type="number"
                        value={emailSettings.sendDays} 
                        onChange={handleEmailSettingsChange} 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overdueTemplate">
                    Template de E-mail para Cobranças
                  </Label>
                  <textarea
                    className="flex min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    id="overdueTemplate"
                    name="overdueTemplate"
                    value={emailSettings.overdueTemplate}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, overdueTemplate: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Use {'{invoice}'}, {'{value}'}, {'{dueDate}'}, {'{client}'} como variáveis.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={testEmailConnection}>Testar Conexão</Button>
                <Button onClick={handleSaveEmailSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Acesso</CardTitle>
                <CardDescription>
                  Configure os diferentes níveis de acesso ao sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessTypes.map(type => (
                    <div key={type.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-medium">{type.name}</h3>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`view-${type.id}`} 
                            checked={type.permissions.includes("view")}
                          />
                          <label 
                            htmlFor={`view-${type.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Visualizar
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`edit-${type.id}`} 
                            checked={type.permissions.includes("edit")}
                          />
                          <label 
                            htmlFor={`edit-${type.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Editar
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`delete-${type.id}`} 
                            checked={type.permissions.includes("delete")}
                          />
                          <label 
                            htmlFor={`delete-${type.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Excluir
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`admin-${type.id}`} 
                            checked={type.permissions.includes("admin")}
                          />
                          <label 
                            htmlFor={`admin-${type.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Admin
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveAccessTypes} className="ml-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Tipos de Acesso
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Ajuste as configurações básicas do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input id="companyName" defaultValue="Três Pharma Distribuidora" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked id="notifications" />
                    <Label htmlFor="notifications">Ativar notificações do sistema</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked id="darkMode" />
                    <Label htmlFor="darkMode">Modo escuro</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">Salvar Configurações</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
