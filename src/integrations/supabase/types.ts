export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contas_receber: {
        Row: {
          acrescimo: number | null
          ano_emissao: number | null
          ano_quitacao: number | null
          ano_vencimento: number | null
          cidade: string | null
          cod_cta_credito: number | null
          cod_cta_debito: number | null
          cod_fornecedor: number | null
          cpf_cnpj: string | null
          data_emissao: string | null
          data_quitacao: string | null
          data_vencimento: string | null
          desconto: number | null
          forma_cobranca: string | null
          mes_emissao: number | null
          mes_quitacao: number | null
          mes_vencimento: number | null
          nome_cta_credito: string | null
          nome_cta_debito: string | null
          nome_fornecedor: string | null
          nome_vendedor: string | null
          nosso_numero: string | null
          num_documento: string | null
          num_nf: number | null
          num_pedido: number | null
          observacao: string | null
          parcela: number | null
          sequencial_cr: number | null
          uf: string | null
          valor_parcela: number | null
        }
        Insert: {
          acrescimo?: number | null
          ano_emissao?: number | null
          ano_quitacao?: number | null
          ano_vencimento?: number | null
          cidade?: string | null
          cod_cta_credito?: number | null
          cod_cta_debito?: number | null
          cod_fornecedor?: number | null
          cpf_cnpj?: string | null
          data_emissao?: string | null
          data_quitacao?: string | null
          data_vencimento?: string | null
          desconto?: number | null
          forma_cobranca?: string | null
          mes_emissao?: number | null
          mes_quitacao?: number | null
          mes_vencimento?: number | null
          nome_cta_credito?: string | null
          nome_cta_debito?: string | null
          nome_fornecedor?: string | null
          nome_vendedor?: string | null
          nosso_numero?: string | null
          num_documento?: string | null
          num_nf?: number | null
          num_pedido?: number | null
          observacao?: string | null
          parcela?: number | null
          sequencial_cr?: number | null
          uf?: string | null
          valor_parcela?: number | null
        }
        Update: {
          acrescimo?: number | null
          ano_emissao?: number | null
          ano_quitacao?: number | null
          ano_vencimento?: number | null
          cidade?: string | null
          cod_cta_credito?: number | null
          cod_cta_debito?: number | null
          cod_fornecedor?: number | null
          cpf_cnpj?: string | null
          data_emissao?: string | null
          data_quitacao?: string | null
          data_vencimento?: string | null
          desconto?: number | null
          forma_cobranca?: string | null
          mes_emissao?: number | null
          mes_quitacao?: number | null
          mes_vencimento?: number | null
          nome_cta_credito?: string | null
          nome_cta_debito?: string | null
          nome_fornecedor?: string | null
          nome_vendedor?: string | null
          nosso_numero?: string | null
          num_documento?: string | null
          num_nf?: number | null
          num_pedido?: number | null
          observacao?: string | null
          parcela?: number | null
          sequencial_cr?: number | null
          uf?: string | null
          valor_parcela?: number | null
        }
        Relationships: []
      }
      notas_fiscais: {
        Row: {
          cidade: string | null
          cliente: string | null
          cmv_total: number | null
          cod_cliente: string | null
          codigo_cliente: string | null
          data_emissao: string | null
          data_ultima_atualizacao: string | null
          frete: number | null
          id: number
          numero_cte: string | null
          numero_nf: string | null
          perc_frete: number | null
          regiao: string | null
          status_entrega: string | null
          transportadora: string | null
          uf: string | null
          valor_frete: number | null
          valor_total: number | null
        }
        Insert: {
          cidade?: string | null
          cliente?: string | null
          cmv_total?: number | null
          cod_cliente?: string | null
          codigo_cliente?: string | null
          data_emissao?: string | null
          data_ultima_atualizacao?: string | null
          frete?: number | null
          id?: number
          numero_cte?: string | null
          numero_nf?: string | null
          perc_frete?: number | null
          regiao?: string | null
          status_entrega?: string | null
          transportadora?: string | null
          uf?: string | null
          valor_frete?: number | null
          valor_total?: number | null
        }
        Update: {
          cidade?: string | null
          cliente?: string | null
          cmv_total?: number | null
          cod_cliente?: string | null
          codigo_cliente?: string | null
          data_emissao?: string | null
          data_ultima_atualizacao?: string | null
          frete?: number | null
          id?: number
          numero_cte?: string | null
          numero_nf?: string | null
          perc_frete?: number | null
          regiao?: string | null
          status_entrega?: string | null
          transportadora?: string | null
          uf?: string | null
          valor_frete?: number | null
          valor_total?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          client_id: string | null
          cnpj: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          cnpj?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
