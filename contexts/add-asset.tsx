import React, { createContext, useState, useCallback } from 'react';

interface AddAssetContextType {
  showAddModal: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
}

export const AddAssetContext = createContext<AddAssetContextType>({
  showAddModal: false,
  openAddModal: () => {},
  closeAddModal: () => {},
});

export const AddAssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const openAddModal = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  return (
    <AddAssetContext.Provider value={{ showAddModal, openAddModal, closeAddModal }}>
      {children}
    </AddAssetContext.Provider>
  );
};

export const useAddAssetModal = () => {
  const context = React.useContext(AddAssetContext);
  if (!context) {
    throw new Error('useAddAssetModal must be used within AddAssetProvider');
  }
  return context;
};
