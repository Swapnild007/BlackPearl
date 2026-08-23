package com.blackpearl.lab

import android.app.Activity
import android.os.Bundle
import android.os.Build
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.view.Gravity
import android.view.View
import android.widget.*
import java.net.HttpURLConnection
import java.net.InetAddress
import java.net.URL
import java.net.URI
import java.security.MessageDigest
import java.text.SimpleDateFormat
import java.util.*
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec
import android.util.Base64
import java.net.URLEncoder
import java.net.URLDecoder

class MainActivity : Activity() {
    private val bg = Color.rgb(5, 8, 12)
    private val surface = Color.rgb(18, 24, 32)
    private val surface2 = Color.rgb(24, 31, 41)
    private val cyan = Color.rgb(45, 220, 218)
    private val green = Color.rgb(80, 230, 160)
    private val white = Color.WHITE
    private val muted = Color.rgb(165, 175, 188)
    private val history = ArrayDeque<View>()
    private var current: View? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = bg
        window.navigationBarColor = Color.BLACK
        home()
    }

    override fun onBackPressed() {
        if (history.isNotEmpty()) {
            val previous = history.removeLast()
            current = previous
            setContentView(previous)
        } else {
            super.onBackPressed()
        }
    }

    private fun showScreen(title: String, content: View) {
        current?.let { history.addLast(it) }
        val root = LinearLayout(this)
        root.orientation = LinearLayout.VERTICAL
        root.setBackgroundColor(bg)
        root.addView(topBar(title, true), LinearLayout.LayoutParams(-1, dp(64)))
        val scroll = ScrollView(this)
        scroll.isFillViewport = true
        scroll.addView(content)
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        current = root
        setContentView(root)
    }

    private fun home() {
        history.clear()
        val root = LinearLayout(this)
        root.orientation = LinearLayout.VERTICAL
        root.setBackgroundColor(bg)
        root.addView(topBar("BLACKPEARL", false), LinearLayout.LayoutParams(-1, dp(64)))
        val scroll = ScrollView(this)
        val body = LinearLayout(this)
        body.orientation = LinearLayout.VERTICAL
        body.setPadding(dp(14), dp(8), dp(14), dp(24))
        body.addView(hero())
        body.addView(section("OPERATIONS"))
        body.addView(card("◉", "RECON", "Local asset discovery and target notes") { recon() })
        body.addView(card("⌁", "NETWORK", "Interfaces, connectivity and localhost checks") { network() })
        body.addView(card("⌘", "WEB SECURITY", "Safe HTTP inspection for localhost only") { webSecurity() })
        body.addView(section("ANALYSIS"))
        body.addView(card("▣", "ANDROID SECURITY", "Device security posture and app environment") { androidSecurity() })
        body.addView(card("#", "CRYPTO / HASH", "SHA, Base64 and AES local utilities") { crypto() })
        body.addView(section("LABS & REPORTING"))
        body.addView(card("⚗", "CTF LABS", "Controlled local challenges") { labs() })
        body.addView(card("!", "FINDINGS", "Severity tracking and evidence notes") { findings() })
        body.addView(card("▤", "REPORTS", "Generate a local security report") { reports() })
        body.addView(card("⚙", "SETTINGS", "Safety scope and application settings") { settings() })
        scroll.addView(body)
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        current = root
        setContentView(root)
    }

    private fun topBar(title: String, back: Boolean): View {
        val bar = LinearLayout(this)
        bar.orientation = LinearLayout.HORIZONTAL
        bar.gravity = Gravity.CENTER_VERTICAL
        bar.setPadding(dp(8), 0, dp(12), 0)
        bar.setBackgroundColor(bg)
        if (back) {
            val b = textButton("‹", 34, white)
            b.setOnClickListener { onBackPressed() }
            bar.addView(b, LinearLayout.LayoutParams(dp(48), -1))
        }
        val t = TextView(this)
        t.text = title
        t.setTextColor(white)
        t.textSize = 22f
        t.typeface = Typeface.create("sans-serif", Typeface.BOLD)
        bar.addView(t, LinearLayout.LayoutParams(0, -1, 1f))
        val badge = TextView(this)
        badge.text = "SAFE"
        badge.setTextColor(green)
        badge.textSize = 11f
        badge.gravity = Gravity.CENTER
        badge.background = rounded(Color.TRANSPARENT, cyan, 1, 14)
        bar.addView(badge, LinearLayout.LayoutParams(dp(52), dp(30)))
        return bar
    }

    private fun hero(): View {
        val box = LinearLayout(this)
        box.orientation = LinearLayout.VERTICAL
        box.setPadding(dp(18), dp(18), dp(18), dp(18))
        box.background = rounded(surface2, Color.TRANSPARENT, 0, 18)
        val title = TextView(this)
        title.text = "LEARN. TEST. DEFEND."
        title.setTextColor(white)
        title.textSize = 28f
        title.typeface = Typeface.DEFAULT_BOLD
        box.addView(title)
        val sub = TextView(this)
        sub.text = "A practical white-hat security workstation for Android."
        sub.setTextColor(muted)
        sub.textSize = 15f
        box.addView(sub, LinearLayout.LayoutParams(-1, -2))
        val line = TextView(this)
        line.text = "● LOCAL-FIRST     •     ● AUTHORIZED     •     ● AUDITABLE"
        line.setTextColor(green)
        line.textSize = 11f
        line.setPadding(0, dp(12), 0, 0)
        box.addView(line)
        return box
    }

    private fun section(s: String): View {
        val t = TextView(this)
        t.text = s
        t.setTextColor(muted)
        t.textSize = 12f
        t.typeface = Typeface.DEFAULT_BOLD
        t.setPadding(0, dp(18), 0, dp(8))
        return t
    }

    private fun card(icon: String, title: String, desc: String, action: () -> Unit): View {
        val box = LinearLayout(this)
        box.orientation = LinearLayout.HORIZONTAL
        box.gravity = Gravity.CENTER_VERTICAL
        box.setPadding(dp(14), dp(12), dp(12), dp(12))
        box.background = rounded(surface, Color.TRANSPARENT, 0, 16)
        val i = TextView(this)
        i.text = icon
        i.setTextColor(cyan)
        i.textSize = 26f
        i.gravity = Gravity.CENTER
        box.addView(i, LinearLayout.LayoutParams(dp(48), dp(54)))
        val texts = LinearLayout(this)
        texts.orientation = LinearLayout.VERTICAL
        val t = TextView(this)
        t.text = title
        t.setTextColor(white)
        t.textSize = 17f
        t.typeface = Typeface.DEFAULT_BOLD
        texts.addView(t)
        val d = TextView(this)
        d.text = desc
        d.setTextColor(muted)
        d.textSize = 13f
        texts.addView(d)
        box.addView(texts, LinearLayout.LayoutParams(0, -2, 1f))
        val arrow = TextView(this)
        arrow.text = "›"
        arrow.setTextColor(muted)
        arrow.textSize = 28f
        box.addView(arrow, LinearLayout.LayoutParams(dp(30), -2))
        box.setOnClickListener { action() }
        val p = LinearLayout.LayoutParams(-1, -2)
        p.setMargins(0, 0, 0, dp(8))
        val wrap = FrameLayout(this)
        wrap.addView(box, FrameLayout.LayoutParams(-1, -2))
        wrap.layoutParams = p
        return wrap
    }

    private fun recon() {
        val body = baseBody()
        body.addView(title("LOCAL RECON"))
        body.addView(info("Scope is intentionally restricted to this device and localhost. No remote scanning is performed."))
        val host = EditText(this)
        host.hint = "Hostname or IP (default: localhost)"
        styleInput(host)
        body.addView(host)
        val out = output()
        body.addView(out)
        body.addView(button("RESOLVE HOST") {
            val value = host.text.toString().trim().ifEmpty { "localhost" }
            if (!allowedHost(value)) {
                out.text = "BLOCKED\nOnly localhost / 127.0.0.1 / ::1 are allowed."
                return@button
            }
            Thread {
                try {
                    val addrs = InetAddress.getAllByName(value)
                    val text = buildString {
                        append("HOST: $value\n\n")
                        addrs.forEach { append("• ").append(it.hostAddress).append('\n') }
                    }
                    runOnUiThread { out.text = text }
                } catch (e: Exception) {
                    runOnUiThread { out.text = "ERROR\n${e.message}" }
                }
            }.start()
        })
        showScreen("RECON", body)
    }

    private fun network() {
        val body = baseBody()
        body.addView(title("NETWORK WORKBENCH"))
        body.addView(info("Read-only device/network information. Active probing is restricted to localhost."))
        val out = output()
        body.addView(out)
        body.addView(button("REFRESH STATUS") { out.text = networkStatus() })
        body.addView(button("CHECK LOCALHOST") {
            Thread {
                try {
                    val start = System.currentTimeMillis()
                    val socket = java.net.Socket()
                    socket.connect(java.net.InetSocketAddress("127.0.0.1", 8080), 1000)
                    socket.close()
                    val ms = System.currentTimeMillis() - start
                    runOnUiThread { out.text = "127.0.0.1:8080\nReachable: YES\nElapsed: ${ms}ms" }
                } catch (e: Exception) {
                    runOnUiThread { out.text = "127.0.0.1:8080\nReachable: NO\nNo service is listening on port 8080." }
                }
            }.start()
        })
        out.text = networkStatus()
        showScreen("NETWORK", body)
    }

    private fun networkStatus(): String {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val n = if (Build.VERSION.SDK_INT >= 23) cm.activeNetwork else null
        val caps = if (Build.VERSION.SDK_INT >= 23 && n != null) cm.getNetworkCapabilities(n) else null
        val type = when {
            caps?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true -> "Wi-Fi"
            caps?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true -> "Cellular"
            caps?.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) == true -> "Ethernet"
            else -> "Offline / unknown"
        }
        val validated = caps?.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED) == true
        return "CONNECTIVITY\n$type\nValidated internet: ${if (validated) "YES" else "NO / UNKNOWN"}\n\nAndroid: ${Build.VERSION.RELEASE}\nAPI: ${Build.VERSION.SDK_INT}\nDevice: ${Build.MANUFACTURER} ${Build.MODEL}"
    }

    private fun webSecurity() {
        val body = baseBody()
        body.addView(title("LOCAL HTTP INSPECTOR"))
        body.addView(info("Safe mode: requests are allowed only to localhost. Useful for testing a local web server you control."))
        val input = EditText(this)
        input.hint = "http://127.0.0.1:8080/"
        styleInput(input)
        body.addView(input)
        val out = output()
        body.addView(out)
        body.addView(button("INSPECT") {
            val raw = input.text.toString().trim()
            try {
                val uri = URI(raw)
                if (!allowedHost(uri.host ?: "")) {
                    out.text = "BLOCKED\nRemote targets are disabled."
                    return@button
                }
                Thread {
                    try {
                        val c = URL(raw).openConnection() as HttpURLConnection
                        c.requestMethod = "HEAD"
                        c.connectTimeout = 2500
                        c.readTimeout = 2500
                        c.instanceFollowRedirects = false
                        c.connect()
                        val text = buildString {
                            append("HTTP ${c.responseCode} ${c.responseMessage}\n\n")
                            c.headerFields.forEach { (k, v) -> if (k != null) append(k).append(": ").append(v.joinToString(", ")).append('\n') }
                        }
                        c.disconnect()
                        runOnUiThread { out.text = text }
                    } catch (e: Exception) {
                        runOnUiThread { out.text = "ERROR\n${e.message}" }
                    }
                }.start()
            } catch (e: Exception) {
                out.text = "INVALID URL\nUse http://127.0.0.1:PORT/"
            }
        })
        showScreen("WEB SECURITY", body)
    }

    private fun androidSecurity() {
        val body = baseBody()
        body.addView(title("ANDROID SECURITY"))
        body.addView(info("Local posture checks. This module does not attempt privilege escalation or bypass Android security controls."))
        val out = output()
        body.addView(out)
        val checks = mutableListOf<String>()
        checks.add("DEVICE: ${Build.MANUFACTURER} ${Build.MODEL}")
        checks.add("ANDROID: ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT})")
        checks.add("DEBUGGABLE BUILD: ${(applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0}")
        checks.add("APP UID: ${applicationInfo.uid}")
        checks.add("PACKAGE: $packageName")
        out.text = checks.joinToString("\n\n")
        body.addView(button("RECHECK") { out.text = checks.joinToString("\n\n") })
        showScreen("ANDROID SECURITY", body)
    }

    private fun crypto() {
        val body = baseBody()
        body.addView(title("CRYPTO / HASH TOOLKIT"))
        val input = EditText(this)
        input.hint = "Input text"
        input.minLines = 4
        input.gravity = Gravity.TOP
        styleInput(input)
        body.addView(input)
        val key = EditText(this)
        key.hint = "AES key: 16 / 24 / 32 characters"
        styleInput(key)
        body.addView(key)
        val out = output()
        body.addView(out)
        body.addView(button("SHA-256") { out.text = digest(input.text.toString(), "SHA-256") })
        body.addView(button("SHA-512") { out.text = digest(input.text.toString(), "SHA-512") })
        body.addView(button("BASE64 ENCODE") { out.text = Base64.encodeToString(input.text.toString().toByteArray(Charsets.UTF_8), Base64.NO_WRAP) })
        body.addView(button("BASE64 DECODE") { try { out.text = String(Base64.decode(input.text.toString(), Base64.DEFAULT), Charsets.UTF_8) } catch (e: Exception) { out.text = "INVALID BASE64" } })
        body.addView(button("URL ENCODE") { try { out.text = URLEncoder.encode(input.text.toString(), "UTF-8") } catch (e: Exception) { out.text = e.message } })
        body.addView(button("URL DECODE") { try { out.text = URLDecoder.decode(input.text.toString(), "UTF-8") } catch (e: Exception) { out.text = e.message } })
        body.addView(button("AES ENCRYPT") { out.text = aes(input.text.toString(), key.text.toString(), true) })
        body.addView(button("AES DECRYPT") { out.text = aes(input.text.toString(), key.text.toString(), false) })
        showScreen("CRYPTO / HASH", body)
    }

    private fun digest(value: String, algorithm: String): String {
        val md = MessageDigest.getInstance(algorithm)
        return md.digest(value.toByteArray(Charsets.UTF_8)).joinToString("") { "%02x".format(it) }
    }

    private fun aes(value: String, key: String, encrypt: Boolean): String {
        if (key.length != 16 && key.length != 24 && key.length != 32) return "KEY ERROR\nUse 16, 24 or 32 characters."
        return try {
            val cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
            cipher.init(if (encrypt) Cipher.ENCRYPT_MODE else Cipher.DECRYPT_MODE, SecretKeySpec(key.toByteArray(Charsets.UTF_8), "AES"))
            if (encrypt) Base64.encodeToString(cipher.doFinal(value.toByteArray(Charsets.UTF_8)), Base64.NO_WRAP)
            else String(cipher.doFinal(Base64.decode(value, Base64.DEFAULT)), Charsets.UTF_8)
        } catch (e: Exception) { "AES ERROR\n${e.message}" }
    }

    private fun labs() {
        val body = baseBody()
        body.addView(title("CONTROLLED CTF LABS"))
        body.addView(info("These challenges are self-contained. No internet target is contacted."))
        labCard(body, "01", "HASH HUNT", "Find the SHA-256 digest of a supplied local phrase.")
        labCard(body, "02", "ENCODING HUNT", "Decode a Base64 value and identify the message.")
        labCard(body, "03", "AUTH LOGIC", "Identify why a sample authorization decision is unsafe.")
        showScreen("CTF LABS", body)
    }

    private fun labCard(body: LinearLayout, no: String, name: String, desc: String) {
        body.addView(card(no, name, desc) {
            val b = baseBody()
            b.addView(title(name))
            b.addView(info("Challenge $no\n\n$desc"))
            val input = EditText(this)
            input.hint = "Your answer / analysis"
            input.minLines = 3
            input.gravity = Gravity.TOP
            styleInput(input)
            b.addView(input)
            val result = output()
            b.addView(result)
            b.addView(button("CHECK") { result.text = "Recorded locally. Use the Findings module to document your reasoning." })
            showScreen(name, b)
        })
    }

    private fun findings() {
        val body = baseBody()
        body.addView(title("FINDINGS TRACKER"))
        val name = EditText(this); name.hint = "Finding title"; styleInput(name); body.addView(name)
        val severity = Spinner(this)
        severity.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, arrayOf("INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"))
        body.addView(severity, LinearLayout.LayoutParams(-1, dp(52)))
        val evidence = EditText(this); evidence.hint = "Evidence / notes"; evidence.minLines = 5; evidence.gravity = Gravity.TOP; styleInput(evidence); body.addView(evidence)
        val out = output(); body.addView(out)
        body.addView(button("CREATE LOCAL FINDING") {
            val stamp = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date())
            out.text = "FINDING CREATED\n\nTitle: ${name.text}\nSeverity: ${severity.selectedItem}\nTime: $stamp\n\n${evidence.text}"
        })
        showScreen("FINDINGS", body)
    }

    private fun reports() {
        val body = baseBody()
        body.addView(title("SECURITY REPORT"))
        body.addView(info("Generate a plain-text local report from the information you enter. No data is uploaded."))
        val reportTitle = EditText(this); reportTitle.hint = "Assessment title"; styleInput(reportTitle); body.addView(reportTitle)
        val scope = EditText(this); scope.hint = "Scope"; styleInput(scope); body.addView(scope)
        val findings = EditText(this); findings.hint = "Findings"; findings.minLines = 6; findings.gravity = Gravity.TOP; styleInput(findings); body.addView(findings)
        val out = output(); body.addView(out)
        body.addView(button("GENERATE REPORT") {
            out.text = "BLACKPEARL SECURITY REPORT\n==========================\nTitle: ${reportTitle.text}\nScope: ${scope.text}\nDate: ${Date()}\n\nFINDINGS\n${findings.text}\n\nSAFETY\nTesting restricted to authorized/local targets."
        })
        showScreen("REPORTS", body)
    }

    private fun settings() {
        val body = baseBody()
        body.addView(title("SETTINGS & SAFETY"))
        body.addView(info("BlackPearl is designed as a white-hat security workstation. Remote scanning, credential theft, exploitation, persistence, evasion and unauthorized access are intentionally excluded."))
        val sw = Switch(this)
        sw.text = "LOCAL-ONLY MODE"
        sw.isChecked = true
        sw.isEnabled = false
        sw.setTextColor(white)
        body.addView(sw, LinearLayout.LayoutParams(-1, dp(54)))
        body.addView(info("Enabled by design. Future modules must preserve this safety boundary."))
        showScreen("SETTINGS", body)
    }

    private fun baseBody(): LinearLayout {
        val body = LinearLayout(this)
        body.orientation = LinearLayout.VERTICAL
        body.setPadding(dp(14), dp(10), dp(14), dp(24))
        body.setBackgroundColor(bg)
        return body
    }

    private fun title(text: String): View {
        val t = TextView(this)
        t.text = text
        t.setTextColor(white)
        t.textSize = 27f
        t.typeface = Typeface.DEFAULT_BOLD
        t.setPadding(0, dp(8), 0, dp(12))
        return t
    }

    private fun info(text: String): View {
        val t = TextView(this)
        t.text = text
        t.setTextColor(muted)
        t.textSize = 14f
        t.setPadding(dp(14), dp(12), dp(14), dp(12))
        t.background = rounded(surface2, Color.TRANSPARENT, 0, 14)
        val p = LinearLayout.LayoutParams(-1, -2)
        p.setMargins(0, 0, 0, dp(10))
        return wrap(t, p)
    }

    private fun output(): TextView {
        val t = TextView(this)
        t.setTextColor(green)
        t.textSize = 13f
        t.typeface = Typeface.MONOSPACE
        t.setPadding(dp(14), dp(14), dp(14), dp(14))
        t.background = rounded(Color.rgb(10, 14, 19), Color.TRANSPARENT, 0, 14)
        val p = LinearLayout.LayoutParams(-1, -2)
        p.setMargins(0, dp(10), 0, dp(10))
        t.layoutParams = p
        return t
    }

    private fun button(label: String, action: () -> Unit): View {
        val b = Button(this)
        b.text = label
        b.setTextColor(Color.BLACK)
        b.textSize = 12f
        b.typeface = Typeface.DEFAULT_BOLD
        b.background = rounded(cyan, Color.TRANSPARENT, 0, 14)
        b.setOnClickListener { action() }
        val p = LinearLayout.LayoutParams(-1, dp(50))
        p.setMargins(0, 0, 0, dp(8))
        b.layoutParams = p
        return b
    }

    private fun textButton(text: String, size: Int, color: Int): TextView {
        val t = TextView(this)
        t.text = text
        t.textSize = size.toFloat()
        t.setTextColor(color)
        t.gravity = Gravity.CENTER
        return t
    }

    private fun styleInput(e: EditText) {
        e.setTextColor(white)
        e.setHintTextColor(muted)
        e.textSize = 15f
        e.setPadding(dp(14), dp(8), dp(14), dp(8))
        e.background = rounded(surface, Color.TRANSPARENT, 0, 14)
        val p = LinearLayout.LayoutParams(-1, -2)
        p.setMargins(0, 0, 0, dp(8))
        e.layoutParams = p
    }

    private fun rounded(fill: Int, stroke: Int, width: Int, radius: Int): GradientDrawable {
        val d = GradientDrawable()
        d.setColor(fill)
        d.cornerRadius = dp(radius).toFloat()
        if (width > 0) d.setStroke(dp(width), stroke)
        return d
    }

    private fun wrap(v: View, p: LinearLayout.LayoutParams): View {
        val f = FrameLayout(this)
        f.addView(v, FrameLayout.LayoutParams(-1, -2))
        f.layoutParams = p
        return f
    }

    private fun dp(v: Int): Int = (v * resources.displayMetrics.density).toInt()

    private fun allowedHost(host: String): Boolean {
        val normalized = host.trim().lowercase(Locale.US).removeSuffix(".")
        return normalized == "localhost" ||
            normalized == "127.0.0.1" ||
            normalized == "::1" ||
            normalized == "0:0:0:0:0:0:0:1"
    }
}
