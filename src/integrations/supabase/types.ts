export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      communities: {
        Row: {
          allow_free_join: boolean;
          allow_invite_link: boolean;
          allow_request_to_join: boolean;
          avatar_url: string | null;
          cover_url: string | null;
          created_at: string;
          created_by: string;
          description: string | null;
          id: string;
          invite_code: string;
          name: string;
          type: Database["public"]["Enums"]["community_type"];
          updated_at: string;
        };
        Insert: {
          allow_free_join?: boolean;
          allow_invite_link?: boolean;
          allow_request_to_join?: boolean;
          avatar_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          created_by: string;
          description?: string | null;
          id?: string;
          invite_code?: string;
          name: string;
          type?: Database["public"]["Enums"]["community_type"];
          updated_at?: string;
        };
        Update: {
          allow_free_join?: boolean;
          allow_invite_link?: boolean;
          allow_request_to_join?: boolean;
          avatar_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          id?: string;
          invite_code?: string;
          name?: string;
          type?: Database["public"]["Enums"]["community_type"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "communities_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      community_members: {
        Row: {
          community_id: string;
          id: string;
          joined_at: string;
          role: Database["public"]["Enums"]["community_member_role"];
          status: Database["public"]["Enums"]["community_member_status"];
          user_id: string;
        };
        Insert: {
          community_id: string;
          id?: string;
          joined_at?: string;
          role?: Database["public"]["Enums"]["community_member_role"];
          status?: Database["public"]["Enums"]["community_member_status"];
          user_id: string;
        };
        Update: {
          community_id?: string;
          id?: string;
          joined_at?: string;
          role?: Database["public"]["Enums"]["community_member_role"];
          status?: Database["public"]["Enums"]["community_member_status"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      event_comments: {
        Row: {
          content: string;
          created_at: string;
          event_id: string;
          id: string;
          parent_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          event_id: string;
          id?: string;
          parent_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          event_id?: string;
          id?: string;
          parent_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_comments_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "event_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      event_organizers: {
        Row: {
          added_at: string;
          event_id: string;
          id: string;
          user_id: string;
        };
        Insert: {
          added_at?: string;
          event_id: string;
          id?: string;
          user_id: string;
        };
        Update: {
          added_at?: string;
          event_id?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_organizers_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_organizers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          capacity: number | null;
          community_id: string | null;
          cover_url: string | null;
          created_at: string;
          created_by: string;
          description: string | null;
          id: string;
          invite_code: string;
          location: string | null;
          location_type: Database["public"]["Enums"]["event_location_type"];
          starts_at: string;
          status: Database["public"]["Enums"]["event_status"];
          title: string;
          updated_at: string;
          visibility: Database["public"]["Enums"]["event_visibility"];
        };
        Insert: {
          capacity?: number | null;
          community_id?: string | null;
          cover_url?: string | null;
          created_at?: string;
          created_by: string;
          description?: string | null;
          id?: string;
          invite_code?: string;
          location?: string | null;
          location_type?: Database["public"]["Enums"]["event_location_type"];
          starts_at: string;
          status?: Database["public"]["Enums"]["event_status"];
          title: string;
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["event_visibility"];
        };
        Update: {
          capacity?: number | null;
          community_id?: string | null;
          cover_url?: string | null;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          id?: string;
          invite_code?: string;
          location?: string | null;
          location_type?: Database["public"]["Enums"]["event_location_type"];
          starts_at?: string;
          status?: Database["public"]["Enums"]["event_status"];
          title?: string;
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["event_visibility"];
        };
        Relationships: [
          {
            foreignKeyName: "events_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          email: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name: string;
          email?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string;
          email?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rsvps: {
        Row: {
          created_at: string;
          event_id: string;
          id: string;
          responded_at: string | null;
          status: Database["public"]["Enums"]["rsvp_status"];
          updated_at: string;
          user_id: string;
          waitlist_position: number | null;
        };
        Insert: {
          created_at?: string;
          event_id: string;
          id?: string;
          responded_at?: string | null;
          status?: Database["public"]["Enums"]["rsvp_status"];
          updated_at?: string;
          user_id: string;
          waitlist_position?: number | null;
        };
        Update: {
          created_at?: string;
          event_id?: string;
          id?: string;
          responded_at?: string | null;
          status?: Database["public"]["Enums"]["rsvp_status"];
          updated_at?: string;
          user_id?: string;
          waitlist_position?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rsvps_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_invite: {
        Args: {
          p_code: string;
          p_status: Database["public"]["Enums"]["rsvp_status"];
        };
        Returns: string;
      };
      can_view_event: {
        Args: { _event_id: string; _user_id: string };
        Returns: boolean;
      };
      get_event_by_invite_code: {
        Args: { p_code: string };
        Returns: {
          capacity: number | null;
          community_id: string | null;
          cover_url: string | null;
          created_at: string;
          created_by: string;
          description: string | null;
          id: string;
          invite_code: string;
          location: string | null;
          location_type: Database["public"]["Enums"]["event_location_type"];
          starts_at: string;
          status: Database["public"]["Enums"]["event_status"];
          title: string;
          updated_at: string;
          visibility: Database["public"]["Enums"]["event_visibility"];
        }[];
        SetofOptions: {
          from: "*";
          to: "events";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      has_rsvp: {
        Args: { _event_id: string; _user_id: string };
        Returns: boolean;
      };
      is_community_admin: {
        Args: { _community_id: string; _user_id: string };
        Returns: boolean;
      };
      is_community_member: {
        Args: { _community_id: string; _user_id: string };
        Returns: boolean;
      };
      is_event_organizer: {
        Args: { _event_id: string; _user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      community_member_role: "admin" | "member";
      community_member_status: "active" | "pending" | "banned";
      community_type: "public" | "private";
      event_location_type: "in_person" | "online";
      event_status: "draft" | "published" | "cancelled" | "finished";
      event_visibility: "private" | "community";
      rsvp_status: "pending" | "confirmed" | "declined" | "waitlisted";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      community_member_role: ["admin", "member"],
      community_member_status: ["active", "pending", "banned"],
      community_type: ["public", "private"],
      event_location_type: ["in_person", "online"],
      event_status: ["draft", "published", "cancelled", "finished"],
      event_visibility: ["private", "community"],
      rsvp_status: ["pending", "confirmed", "declined", "waitlisted"],
    },
  },
} as const;
