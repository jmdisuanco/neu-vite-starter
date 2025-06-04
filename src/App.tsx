import {  useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { filesystem ,os } from "@neutralinojs/lib";
 
function App() {
  const [message, setMessage] = useState('')

useEffect(() => {
            os.showMessageBox('Welcome', 'Hello from Neutralinojs (via @neutralinojs/lib)!');    
  }, []); // Runs once on component mount

 useEffect(() => {
    filesystem.readDirectory('./').then((data) => {
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

   const handleClick = async () => {
    setMessage('click')

  };  

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
        {message}
        {window.NL_APPID}
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
}

export default App;
