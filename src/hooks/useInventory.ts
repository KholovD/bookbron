import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryAPI } from '@/services/api';
import { showNotification } from '@/utils/notification';

export const useInventory = () => {
  const queryClient = useQueryClient();

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => inventoryAPI.getAll()
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InventoryItem> }) =>
      inventoryAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory']);
      showNotification('Inventar yangilandi', 'success');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory']);
      showNotification('Mahsulot o\'chirildi', 'success');
    }
  });

  return {
    inventory,
    isLoading,
    updateItem: updateMutation.mutate,
    deleteItem: deleteMutation.mutate
  };
}; 