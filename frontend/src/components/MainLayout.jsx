// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import LeftSidebar from './LeftSidebar'

// const MainLayout = () => {
//   return (
//     <div >
//       <LeftSidebar/>
//         <div>
//             <Outlet/>
//         </div>
        
//     </div>
//   )
// }

// export default MainLayout
import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <div className="flex-1 ml-[16%] overflow-y-auto">  {/* left space for fixed sidebar */}
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
