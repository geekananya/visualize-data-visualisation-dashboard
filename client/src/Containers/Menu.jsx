import { NavLink } from 'react-router-dom'
// import dash from '../assets/dashboard.svg'
import logo from '../assets/logo.jpg'
import './Menu.css'

export default function Menu(){
    return (
        <div className="pa3 br3 shadow-5 menu w-25 bg-light-gray">
            <img src={logo} alt='Visualize'></img>
            <NavLink
                to="/dashboard"
                className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                }
            >
                {/* <p><img src={dash} alt='{dashboard}'></img></p> */}
                <button className='pointer mt4 br3 b--blue'><p className='f3 mt2 mb2'>Dashboard</p></button>
            </NavLink>
            <NavLink
                to="/filter"
                className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                }
            >
                {/* <p><img src={filter} alt='add filters'></img></p> */}
                <button className='pointer mt4 br3 b--blue'><p className='f3 mt2 mb2'>Add Filters</p></button>
            </NavLink>
        </div>
    )
}