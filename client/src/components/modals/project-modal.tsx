import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { insertProjectSchema, type InsertProject, type Project } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  isEdit?: boolean;
}

const projectSchema = insertProjectSchema.extend({
  dueDate: insertProjectSchema.shape.dueDate.optional(),
});

const colors = [
  { value: "blue", class: "bg-blue-500 border-blue-600" },
  { value: "green", class: "bg-green-500 border-green-600" },
  { value: "purple", class: "bg-purple-500 border-purple-600" },
  { value: "red", class: "bg-red-500 border-red-600" },
  { value: "yellow", class: "bg-yellow-500 border-yellow-600" },
  { value: "pink", class: "bg-pink-500 border-pink-600" },
];

export default function ProjectModal({ open, onOpenChange, project, isEdit = false }: ProjectModalProps) {
  const [selectedColor, setSelectedColor] = useState(project?.color || "blue");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertProject>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      status: project?.status || "planning",
      color: project?.color || "blue",
      dueDate: project?.dueDate || undefined,
    },
  });

  const saveProject = useMutation({
    mutationFn: async (data: InsertProject) => {
      if (isEdit && project) {
        const response = await apiRequest("PUT", `/api/projects/${project.id}`, data);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/projects", data);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      if (isEdit && project) {
        queryClient.invalidateQueries({ queryKey: ["/api/projects", project.id] });
      }
      toast({ 
        title: isEdit ? "Projeto atualizado com sucesso!" : "Projeto criado com sucesso!" 
      });
      form.reset();
      setSelectedColor("blue");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: isEdit ? "Erro ao atualizar projeto" : "Erro ao criar projeto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    const projectData = {
      ...data,
      color: selectedColor,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
    saveProject.mutate(projectData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEdit ? "Editar Projeto" : "Novo Projeto"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Projeto *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome do projeto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Descreva o objetivo e escopo do projeto"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planning">Planejamento</SelectItem>
                        <SelectItem value="in-progress">Em Progresso</SelectItem>
                        <SelectItem value="review">Em Análise</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="on-hold">Em Pausa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo Final</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Cor do Projeto</FormLabel>
              <div className="flex space-x-3 mt-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-8 h-8 ${color.class} rounded-full border-2 ${
                      selectedColor === color.value
                        ? color.class
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedColor(color.value)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saveProject.isPending}>
                {saveProject.isPending 
                  ? (isEdit ? "Atualizando..." : "Criando...") 
                  : (isEdit ? "Atualizar Projeto" : "Criar Projeto")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
