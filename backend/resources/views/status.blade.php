<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Status</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; }
    .ok { color: green }
    .error { color: red }
    pre { background:#f5f5f5; padding:1rem }
  </style>
</head>
<body>
  <h1>Estado del sistema</h1>
  <p>Estado general: <strong class="{{ $data['status'] == 'ok' ? 'ok' : 'error' }}">{{ $data['status'] }}</strong></p>
  <h2>Comprobaciones</h2>
  <ul>
    @foreach($data['checks'] as $key => $value)
      <li><strong>{{ $key }}:</strong> @if(is_string($value)) <span class="{{ $value == 'ok' ? 'ok' : 'error' }}">{{ $value }}</span> @else <pre>{{ json_encode($value) }}</pre> @endif</li>
    @endforeach
  </ul>
</body>
</html>
