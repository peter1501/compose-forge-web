// Example: Compose Web Canvas Component for Kotlin Playground

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.CanvasBasedWindow
import org.jetbrains.compose.ui.tooling.preview.Preview

// This is how a component should be structured for Canvas rendering
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    CanvasBasedWindow(canvasElementId = "ComposeTarget") {
        MaterialTheme {
            SampleButton()
        }
    }
}

@Composable
fun SampleButton() {
    var count by remember { mutableStateOf(0) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "You have clicked $count times",
            style = MaterialTheme.typography.headlineMedium
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(
            onClick = { count++ },
            modifier = Modifier.padding(8.dp)
        ) {
            Text("Click Me!")
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        OutlinedButton(
            onClick = { count = 0 },
            enabled = count > 0
        ) {
            Text("Reset Counter")
        }
    }
}

// Regular component code (without Canvas wrapper) that users would submit
@Composable
@Preview
fun MyCustomButton(
    text: String = "Click Me",
    onClick: () -> Unit = {},
    enabled: Boolean = true
) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = Modifier.padding(horizontal = 16.dp)
    ) {
        Text(text = text)
    }
}