export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Instrument: {
        Row: {
          accuracy: number
          calibrationDate: string
          id: number
          location: string
          lowerLimit: number
          manufacturer: string
          measurementUnitId: number
          model: string
          name: string
          notes: string | null
          resolution: number
          serialNumber: string
          upperLimit: number
          verificationDate: string
          verificationDueDate: string
        }
        Insert: {
          accuracy: number
          calibrationDate: string
          id?: number
          location: string
          lowerLimit: number
          manufacturer: string
          measurementUnitId: number
          model: string
          name: string
          notes?: string | null
          resolution: number
          serialNumber: string
          upperLimit: number
          verificationDate: string
          verificationDueDate: string
        }
        Update: {
          accuracy?: number
          calibrationDate?: string
          id?: number
          location?: string
          lowerLimit?: number
          manufacturer?: string
          measurementUnitId?: number
          model?: string
          name?: string
          notes?: string | null
          resolution?: number
          serialNumber?: string
          upperLimit?: number
          verificationDate?: string
          verificationDueDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "Instrument_measurementUnitId_fkey"
            columns: ["measurementUnitId"]
            referencedRelation: "MeasurementUnit"
            referencedColumns: ["id"]
          }
        ]
      }
      Measurement: {
        Row: {
          finishedAt: string | null
          id: number
          programId: number
          startedAt: string
        }
        Insert: {
          finishedAt?: string | null
          id?: number
          programId: number
          startedAt: string
        }
        Update: {
          finishedAt?: string | null
          id?: number
          programId?: number
          startedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Measurement_programId_fkey"
            columns: ["programId"]
            referencedRelation: "MeasurementProgram"
            referencedColumns: ["id"]
          }
        ]
      }
      MeasurementProgram: {
        Row: {
          createdAt: string
          description: string | null
          id: number
          name: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: number
          name: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: number
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      MeasurementProgramStep: {
        Row: {
          description: string | null
          id: number
          instrumentId: number
          lsl: number
          measurementUnitId: number
          name: string
          order: number
          programId: number
          targetValue: number
          usl: number
        }
        Insert: {
          description?: string | null
          id?: number
          instrumentId: number
          lsl: number
          measurementUnitId: number
          name: string
          order: number
          programId: number
          targetValue: number
          usl: number
        }
        Update: {
          description?: string | null
          id?: number
          instrumentId?: number
          lsl?: number
          measurementUnitId?: number
          name?: string
          order?: number
          programId?: number
          targetValue?: number
          usl?: number
        }
        Relationships: [
          {
            foreignKeyName: "MeasurementProgramStep_instrumentId_fkey"
            columns: ["instrumentId"]
            referencedRelation: "Instrument"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MeasurementProgramStep_measurementUnitId_fkey"
            columns: ["measurementUnitId"]
            referencedRelation: "MeasurementUnit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MeasurementProgramStep_programId_fkey"
            columns: ["programId"]
            referencedRelation: "MeasurementProgram"
            referencedColumns: ["id"]
          }
        ]
      }
      MeasurementStep: {
        Row: {
          id: number
          instrumentId: number
          measurementProgramStepId: number
          measurmentId: number
          operatorId: number
          realValue: number
          status: Database["public"]["Enums"]["MeasurementStepStatus"]
        }
        Insert: {
          id?: number
          instrumentId: number
          measurementProgramStepId: number
          measurmentId: number
          operatorId: number
          realValue?: number
          status?: Database["public"]["Enums"]["MeasurementStepStatus"]
        }
        Update: {
          id?: number
          instrumentId?: number
          measurementProgramStepId?: number
          measurmentId?: number
          operatorId?: number
          realValue?: number
          status?: Database["public"]["Enums"]["MeasurementStepStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "MeasurementStep_instrumentId_fkey"
            columns: ["instrumentId"]
            referencedRelation: "Instrument"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MeasurementStep_measurementProgramStepId_fkey"
            columns: ["measurementProgramStepId"]
            referencedRelation: "MeasurementProgramStep"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MeasurementStep_measurmentId_fkey"
            columns: ["measurmentId"]
            referencedRelation: "Measurement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MeasurementStep_operatorId_fkey"
            columns: ["operatorId"]
            referencedRelation: "Operator"
            referencedColumns: ["id"]
          }
        ]
      }
      MeasurementUnit: {
        Row: {
          id: number
          name: string
          symbol: string
        }
        Insert: {
          id?: number
          name: string
          symbol: string
        }
        Update: {
          id?: number
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      Operator: {
        Row: {
          certificationDate: string
          certificationExpiryDate: string
          certificationNumber: string
          id: number
          userId: string
        }
        Insert: {
          certificationDate: string
          certificationExpiryDate: string
          certificationNumber: string
          id?: number
          userId: string
        }
        Update: {
          certificationDate?: string
          certificationExpiryDate?: string
          certificationNumber?: string
          id?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Operator_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      MeasurementStepStatus: "Done" | "InProgress"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
export type DBTables = Database['public']['Tables']
