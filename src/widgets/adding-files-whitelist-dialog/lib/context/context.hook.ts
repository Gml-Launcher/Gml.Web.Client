import { useContext } from 'react';

import { FilesListContextType } from './context.types';
import { FilesListContext } from './context.provider';

export const useFilesListContext = () => useContext<FilesListContextType>(FilesListContext);
