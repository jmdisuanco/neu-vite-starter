import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { filesystem, } from "@neutralinojs/lib";

function App() {
  const [message, setMessage] = useState('Click Me')


  useEffect(() => {
    filesystem.readDirectory('./').then((data) => {
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  const handleClick = async () => {
    setMessage('Clicked!')

  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <img src="logo.png" alt="Sample Application Logo" className="rounded-[90px] shadow-2xl" />
      <div className="m-2 text-4xl">
        {window.NL_APPID}
      </div>

      <Button onClick={handleClick}> {message}</Button>

      <pre className="m-4 text-teal-500">check out the Console log to see list of files on the system</pre>
    </div>
  );
}

export default App;
