import './App.css'
import Card from './components/Card'

function App() {
  return (
    <div className="app">
      <div className="card-grid">
        <Card price="1000" />
        <Card price="2000"/>
        <Card price="3000"/>
      </div>
    </div>
  )
}

export default App
