import { useEffect, useState } from "react"
import styles from "./AlertBox.module.css"

export default function AlertBox({ withHeader, header, body, type, ...props })
{
  const [visibility, setVisibility] = useState(true)
  const [timeoutID, setTimeoutID] = useState(null)

  function closeNotification()
  {
    const timeout = setTimeout(()=>{
      setTimeoutID(timeout)
      setVisibility(false)
      props.dispatch({
        type: "REMOVE_NOTIFICATION",
        id: props.id
      })
    }, 3000)
  }


  useEffect(()=>{
    visibility && closeNotification()

    return ()=>{
      setVisibility(true)
      clearTimeout(timeoutID)
    }
  }, [])

  return (
    <div className={`${styles["apio__alertBox"]} ${type == "failure" && styles["failure"]} ${visibility ? styles["scale-up-center"] : styles["scale-out-center"]}`}>
      <div className={styles["apio__alertBox--border"]}>
        <div className={`${styles["apio__alertBox--heading"]} ${withHeader ? styles["isVisible"] : styles["notVisible"]}`}>
          <h2>{header}</h2>
          <div className={styles["apio__alertBox--heading--separator"]}></div>
        </div>
        <div className={styles["apio__alertBox--body"]}>
          <p>{body}</p>
        </div>
      </div>
    </div>
  )
}