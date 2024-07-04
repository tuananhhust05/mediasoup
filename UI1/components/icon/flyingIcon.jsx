export default function flyingIcon({Icon,left}){
  return <span className='add-heart' style={{left: `${left}%` }}>
    {Icon}
    </span>
}