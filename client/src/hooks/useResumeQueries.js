import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { resumeApi } from "../api/resumeApi.js";

export const RESUME_QUERY_KEY = ["resumes"];

export const useResumesQuery = (params = {}) => {
  return useQuery({
    queryKey: [...RESUME_QUERY_KEY, params],
    queryFn: () => resumeApi.getResumes(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useResumeDetailQuery = (id) => {
  return useQuery({
    queryKey: ["resume", id],
    queryFn: () => resumeApi.getResume(id),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useCreateResumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => resumeApi.createResume(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_QUERY_KEY });
    },
  });
};

export const useUpdateResumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => resumeApi.updateResume(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: RESUME_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["resume", variables.id] });
    },
  });
};

export const useDuplicateResumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => resumeApi.duplicateResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_QUERY_KEY });
    },
  });
};

export const useDeleteResumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => resumeApi.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_QUERY_KEY });
    },
  });
};
