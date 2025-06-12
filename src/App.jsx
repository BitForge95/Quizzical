import { useState } from "react"
import Questions from "./Components/Questions.jsx"



function StartingPage ({handleClick}) {
  return (
    <>
    <section className="starting-Page">
            <div className="startingPage">
              <h1 className="Main-heading">Quizzical</h1>
              <p className="caption">Because procrastinating with a quiz still counts as productivity... right?</p>
              <div>
                <button className="start-button" onClick={handleClick}>
                    Start Quiz
                </button>
              </div>
            </div>
    </section>
    </>
  )
}

function MainPage () {
  return (
    <>
        <Questions />
    </>
  )
}


export default function App () {

  const [showMainPage,setShowMainPage] = useState(false)

  function handleClick() {
    setShowMainPage(true)
  }

  return (
    <>
      {showMainPage ? <MainPage /> : <StartingPage handleClick = {handleClick}/>}
    </>
  )
}