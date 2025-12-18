import '../App.css'

export default function FooterWidget() {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} Atmos</p>
    </footer>
  )
}
