import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom'
import App from './App'


export default function Router() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/key/:selectedKey/connection/:selectedConnection" children={<App />} />
          <Route path="/" children={<App />} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}
