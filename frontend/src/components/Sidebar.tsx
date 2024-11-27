import { IconPlaneDeparture } from '@tabler/icons-react'
const Sidebar = () => {
  return (
    <div className='w-48 h-screen relative bg-zinc-800 left-0 top-0 z-40 flex flex-col p-2 py-4 gap-4 opacity-30' >
      <h2 className="text-xl w-full text-center font-bold text-primary pb-2 border-white border-b">Flight Simulation</h2>

      {/* Action Buttons */}
      <div className="flex flex-col w-full gap-2 text-primary">
        <button className='flex gap-2 hover:text-white duration-300 hover:translate-x-2'><IconPlaneDeparture /> Start Flight</button>
      </div>

    </div>
  )
}

export default Sidebar