export default function SsrTable({ html, state }) {
  const { store } = state
  const { data = [] } = store

  return html`
  <table>
    <tbody>
      ${data.map((entry) => `<tr>
        <td>${ entry.id }</td>
        <td>${ entry.name }</td>
      </tr>`).join('')}
    </tbody>
  </table>
`
}
