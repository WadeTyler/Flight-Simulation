import { IconX } from '@tabler/icons-react';
import { SetStateAction } from 'react';

export const CloseButton = ({ setState }: { setState: React.Dispatch<SetStateAction<boolean>>; }) => {

  return (
    <IconX className='text-white absolute top-4 right-4 duration-300 hover:rotate-90 cursor-pointer' onClick={() => setState(false)} />
  )
}
