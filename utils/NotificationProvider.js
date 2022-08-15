import { createContext, useContext, useReducer } from "react"
import { v4 } from "uuid"
import { AlertBox } from "../components/exportComps"

const NotificationContext = createContext()

export default function NotificationProvider(props)
{
  const [state, dispatch] = useReducer((state, action)=>{
    switch(action.type){ // action is the object in dispatch it is used as an indicator
    case "ADD_NOTIFICATION":
      return [...state, { ...action.payload }] // this is now state
    case "REMOVE_NOTIFICATION":
      return state.filter(notif => notif.id !== action.id) // action.id not action.payload.id cuz of how it was passed
    default:
      return state
    } 
  }, []) //initial state is an empty array

  // the state array will look like this [{id: v4(), header: body: ...}, {},...]

  return (
    <NotificationContext.Provider value={dispatch}>  
      {/* now we can give dispatch to any component in the app */}
      <div className="notification-wrapper">
        {state.map((notif)=>{
          return <AlertBox key={notif.id} dispatch={dispatch} {...notif}/>
        })}
      </div>
      {props.children}  
      {/* this is _app.js */}
    </NotificationContext.Provider>
  )
}

export function useNotification() // the custom hook
{
  const dispatch = useContext(NotificationContext)

  return (props) => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: v4(),
        ...props // all the other data we'd add
      }
    })
  }
}