import profile from '../assets/profile.png'

export default function Menu(){
    return (
        <div className="flex justify-end pa2 pt3 pr3 mb4 bb sticky">
            <img src={profile} width={30} height={30}></img>
        </div>
    )
}