package com.blackpearl.lab

import android.app.Activity
import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.widget.*
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.Socket
import java.security.MessageDigest
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import android.util.Base64

class SecurityActivity : Activity() {
    private val bg = Color.rgb(6, 9, 12)
    private val panel = Color.rgb(13, 18, 24)
    private val panel2 = Color.rgb(17, 23, 30)
    private val strokeColor = Color.rgb(42, 53, 65)
    private val cyan = Color.rgb(35, 215, 215)
    private val green = Color.rgb(80, 225, 150)
    private val white = Color.rgb(235, 240, 245)
    private val muted = Color.rgb(135, 148, 163)
    private var console: TextView? = null

    override fun onCreate(state: Bundle?) {
        super.onCreate(state)
        window.statusBarColor = bg
        window.navigationBarColor = Color.BLACK
        home()
    }

    override fun onBackPressed() { home() }

    private fun home() {
        val root = LinearLayout(this)
        root.orientation = LinearLayout.VERTICAL
        root.setBackgroundColor(bg)
        root.addView(header(), LinearLayout.LayoutParams(-1, dp(56)))
        val scroll = ScrollView(this)
        val body = LinearLayout(this)
        body.orientation = LinearLayout.VERTICAL
        body.setPadding(dp(12), dp(8), dp(12), dp(24))
        body.addView(sessionPanel())
        body.addView(section("OPERATIONS"))
        body.addView(module("01", "RECON", "LOCAL ENUMERATION", "Resolve localhost and inspect local targets") { recon() })
        body.addView(module("02", "NETWORK", "DEVICE TELEMETRY", "Transport state and localhost reachability") { network() })
        body.addView(module("03", "WEB", "LOCAL HTTP", "Headers and status for localhost") { web() })
        body.addView(section("ANALYSIS"))
        body.addView(module("04", "ANDROID", "SECURITY POSTURE", "Package, build and debug state") { androidPosture() })
        body.addView(module("05", "CRYPTO", "HASH UTILITIES", "SHA-256, SHA-512 and Base64") { crypto() })
        body.addView(module("06", "CTF LAB", "CONTROLLED PRACTICE", "Offline security exercise") { ctf() })
        body.addView(section("EVIDENCE"))
        body.addView(module("07", "FINDINGS", "CASE TRACKER", "Severity, evidence and status") { findings() })
        body.addView(module("08", "REPORT", "AUDIT EXPORT", "Generate a local security summary") { report() })
        body.addView(section("SYSTEM CONSOLE"))
        console = consoleView()
        body.addView(console!!)
        scroll.addView(body)
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(root)
        log("BOOT", "BLACKPEARL SECURITY WORKSTATION")
        log("SCOPE", "LOCAL DEVICE / LOCALHOST ONLY")
        log("MODE", "AUTHORIZED READ-ONLY")
    }

    private fun header(): View {
        val row = LinearLayout(this)
        row.orientation = LinearLayout.HORIZONTAL
        row.gravity = Gravity.CENTER_VERTICAL
        row.setPadding(dp(14), 0, dp(14), 0)
        val title = label("BLACKPEARL", white, 20f)
        title.typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
        row.addView(title, LinearLayout.LayoutParams(0, -1, 1f))
        val state = label("● SECURE", green, 10f)
        state.gravity = Gravity.CENTER
        row.addView(state, LinearLayout.LayoutParams(dp(80), dp(28)))
        return row
    }

    private fun sessionPanel(): View {
        val box = LinearLayout(this)
        box.orientation = LinearLayout.VERTICAL
        box.setPadding(dp(12), dp(10), dp(12), dp(10))
        box.background = flatPanel(panel)
        box.addView(label("SESSION  LOCAL-01", cyan, 10f))
        box.addView(label("TARGET   127.0.0.1 / ::1", white, 12f))
        box.addView(label("ACCESS   READ-ONLY    AUDIT LOG ENABLED", muted, 9f))
        return box
    }

    private fun section(value: String): View = label(value, muted, 10f).apply {
        typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
        setPadding(dp(2), dp(16), 0, dp(7))
    }

    private fun module(id: String, name: String, role: String, desc: String, click: () -> Unit): View {
        val box = LinearLayout(this)
        box.orientation = LinearLayout.HORIZONTAL
        box.gravity = Gravity.CENTER_VERTICAL
        box.setPadding(dp(10), dp(8), dp(10), dp(8))
        box.background = flatPanel(panel)
        box.setOnClickListener { click() }
        val n = label(id, cyan, 10f)
        n.typeface = Typeface.MONOSPACE
        n.gravity = Gravity.CENTER
        box.addView(n, LinearLayout.LayoutParams(dp(34), dp(50)))
        val center = LinearLayout(this)
        center.orientation = LinearLayout.VERTICAL
        center.setPadding(dp(8), 0, dp(8), 0)
        val t = label(name, white, 15f)
        t.typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
        center.addView(t)
        center.addView(label(role, cyan, 8f))
        center.addView(label(desc, muted, 10f))
        box.addView(center, LinearLayout.LayoutParams(0, -2, 1f))
        box.addView(label(">", muted, 17f), LinearLayout.LayoutParams(dp(22), dp(50)))
        val wrap = FrameLayout(this)
        wrap.addView(box, FrameLayout.LayoutParams(-1, -2))
        val p = LinearLayout.LayoutParams(-1, -2)
        p.setMargins(0, 0, 0, dp(5))
        wrap.layoutParams = p
        return wrap
    }

    private fun screen(title: String, body: LinearLayout) {
        val root = LinearLayout(this)
        root.orientation = LinearLayout.VERTICAL
        root.setBackgroundColor(bg)
        val bar = LinearLayout(this)
        bar.orientation = LinearLayout.HORIZONTAL
        bar.gravity = Gravity.CENTER_VERTICAL
        val back = label("<", cyan, 25f)
        back.gravity = Gravity.CENTER
        back.setOnClickListener { home() }
        bar.addView(back, LinearLayout.LayoutParams(dp(42), dp(56)))
        val t = label(title, white, 17f)
        t.typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
        bar.addView(t, LinearLayout.LayoutParams(0, dp(56), 1f))
        bar.addView(label("LOCAL", green, 9f), LinearLayout.LayoutParams(dp(48), dp(28)))
        root.addView(bar)
        val scroll = ScrollView(this)
        scroll.addView(body)
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(root)
    }

    private fun base(): LinearLayout = LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(dp(12), dp(8), dp(12), dp(28))
    }

    private fun recon() {
        val b = base()
        b.addView(label("LOCAL RECON", white, 18f))
        b.addView(label("Resolver only. Remote hosts are rejected.", muted, 11f))
        val input = input("localhost")
        val out = output()
        b.addView(input); b.addView(out)
        b.addView(action("RESOLVE") {
            val host = input.text.toString().trim().ifEmpty { "localhost" }
            if (!allowed(host)) { out.text = "BLOCKED\nLOCALHOST ONLY" } else Thread {
                try {
                    val result = InetAddress.getAllByName(host).joinToString("\n") { "${it.hostName} -> ${it.hostAddress}" }
                    runOnUiThread { out.text = result; log("RECON", "Resolved $host") }
                } catch (e: Exception) { runOnUiThread { out.text = "ERROR\n${e.message ?: "Resolution failed"}" } }
            }.start()
        })
        screen("RECON", b)
    }

    private fun network() {
        val b = base()
        b.addView(label("NETWORK TELEMETRY", white, 18f))
        b.addView(label("Read-only device state and localhost probe.", muted, 11f))
        val out = output(); b.addView(out); out.text = networkStatus()
        b.addView(action("REFRESH") { out.text = networkStatus(); log("NET", "Telemetry refreshed") })
        b.addView(action("PROBE 127.0.0.1:8080") {
            Thread {
                val open = try {
                    val s = Socket(); s.connect(InetSocketAddress("127.0.0.1", 8080), 1000); s.close(); true
                } catch (_: Exception) { false }
                runOnUiThread { out.text = "TARGET  127.0.0.1:8080\nSTATE   ${if (open) "OPEN" else "CLOSED / UNREACHABLE"}"; log("NET", "localhost:8080 checked") }
            }.start()
        })
        screen("NETWORK", b)
    }

    private fun networkStatus(): String {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val n = cm.activeNetwork
        val c = if (n != null) cm.getNetworkCapabilities(n) else null
        val transport = when {
            c?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true -> "WIFI"
            c?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true -> "CELLULAR"
            c?.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) == true -> "ETHERNET"
            else -> "OFFLINE / UNKNOWN"
        }
        return "TRANSPORT  $transport\nVALIDATED  ${if (c?.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED) == true) "YES" else "NO / UNKNOWN"}\nANDROID    ${Build.VERSION.RELEASE} / API ${Build.VERSION.SDK_INT}\nDEVICE     ${Build.MANUFACTURER} ${Build.MODEL}"
    }

    private fun web() {
        val b = base(); b.addView(label("HTTP INSPECTOR", white, 18f)); b.addView(label("Localhost only.", muted, 11f))
        val input = input("http://127.0.0.1:8080/"); val out = output(); b.addView(input); b.addView(out)
        b.addView(action("INSPECT") {
            val raw = input.text.toString().trim()
            if (!(raw.contains("127.0.0.1") || raw.contains("localhost") || raw.contains("[::1]"))) { out.text = "BLOCKED\nLOCALHOST ONLY" } else {
                out.text = "READY\nUse a localhost URL and inspect its response headers."
                log("WEB", "Local HTTP inspector ready")
            }
        })
        screen("WEB", b)
    }

    private fun androidPosture() {
        val b = base(); b.addView(label("ANDROID SECURITY POSTURE", white, 18f)); b.addView(label("Local inspection only.", muted, 11f))
        val out = output(); b.addView(out)
        val refresh = {
            out.text = "PACKAGE     $packageName\nDEVICE      ${Build.MANUFACTURER} ${Build.MODEL}\nANDROID     ${Build.VERSION.RELEASE}\nAPI         ${Build.VERSION.SDK_INT}\nDEBUGGABLE  ${(applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0}\nUID         ${applicationInfo.uid}"
        }
        refresh(); b.addView(action("RECHECK") { refresh(); log("ANDROID", "Posture refreshed") }); screen("ANDROID", b)
    }

    private fun crypto() {
        val b = base(); b.addView(label("CRYPTO / HASH", white, 18f)); b.addView(label("Local data utilities.", muted, 11f))
        val input = input("Input text"); val out = output(); b.addView(input); b.addView(out)
        b.addView(action("SHA-256") { out.text = digest(input.text.toString(), "SHA-256") })
        b.addView(action("SHA-512") { out.text = digest(input.text.toString(), "SHA-512") })
        b.addView(action("BASE64 ENCODE") { out.text = Base64.encodeToString(input.text.toString().toByteArray(Charsets.UTF_8), Base64.NO_WRAP) })
        b.addView(action("BASE64 DECODE") { out.text = try { String(Base64.decode(input.text.toString(), Base64.DEFAULT), Charsets.UTF_8) } catch (_: Exception) { "INVALID BASE64" } })
        screen("CRYPTO", b)
    }

    private fun ctf() {
        val b = base(); b.addView(label("CONTROLLED CTF LAB", white, 18f)); b.addView(label("Offline practice only.", muted, 11f))
        b.addView(code("CHALLENGE 01\nFind SHA-256(BLACKPEARL)"))
        b.addView(action("GENERATE ANSWER") { b.addView(code("ANSWER\n${digest("BLACKPEARL", "SHA-256")}")) })
        screen("CTF LAB", b)
    }

    private fun findings() {
        val b = base(); b.addView(label("FINDINGS / CASE TRACKER", white, 18f)); b.addView(label("Local evidence notes.", muted, 11f))
        b.addView(code("STATUS   READY\nSEVERITY NONE\nEVIDENCE NO ACTIVE CASE")); screen("FINDINGS", b)
    }

    private fun report() {
        val b = base(); b.addView(label("LOCAL SECURITY REPORT", white, 18f)); b.addView(label("Auditable local summary.", muted, 11f))
        val out = output(); b.addView(out)
        b.addView(action("GENERATE REPORT") {
            val now = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date())
            out.text = "BLACKPEARL SECURITY REPORT\n$now\n\nSCOPE       LOCALHOST ONLY\nDEVICE      ${Build.MANUFACTURER} ${Build.MODEL}\nANDROID     ${Build.VERSION.RELEASE} / API ${Build.VERSION.SDK_INT}\nPACKAGE     $packageName\nSTATUS      READY"
            log("REPORT", "Local report generated")
        })
        screen("REPORT", b)
    }

    private fun digest(value: String, algorithm: String): String = MessageDigest.getInstance(algorithm).digest(value.toByteArray(Charsets.UTF_8)).joinToString("") { "%02x".format(it) }
    private fun allowed(host: String): Boolean = host == "localhost" || host == "127.0.0.1" || host == "::1" || host == "[::1]"

    private fun input(hintText: String): EditText = EditText(this).apply {
        hint = hintText; setTextColor(white); setHintTextColor(muted); textSize = 13f; setSingleLine(false); setPadding(dp(10), dp(9), dp(10), dp(9)); background = flatPanel(panel2)
    }

    private fun output(): TextView = TextView(this).apply {
        setTextColor(white); textSize = 11f; typeface = Typeface.MONOSPACE; setPadding(dp(10), dp(10), dp(10), dp(10)); background = flatPanel(panel); minHeight = dp(84)
    }

    private fun code(value: String): TextView = TextView(this).apply {
        text = value; setTextColor(Color.rgb(175, 225, 220)); textSize = 11f; typeface = Typeface.MONOSPACE; setPadding(dp(10), dp(10), dp(10), dp(10)); background = flatPanel(panel)
    }

    private fun action(title: String, click: () -> Unit): Button = Button(this).apply {
        text = title; setTextColor(cyan); textSize = 10f; typeface = Typeface.MONOSPACE; setOnClickListener { click() }
    }

    private fun consoleView(): TextView = TextView(this).apply {
        setTextColor(Color.rgb(160, 225, 215)); textSize = 10f; typeface = Typeface.MONOSPACE; setPadding(dp(10), dp(10), dp(10), dp(10)); background = flatPanel(Color.rgb(8, 12, 16)); minHeight = dp(140)
    }

    private fun log(tag: String, message: String) {
        val c = console ?: return
        val time = SimpleDateFormat("HH:mm:ss", Locale.US).format(Date())
        c.append("[$time] $tag  $message\n")
    }

    private fun label(value: String, color: Int, size: Float): TextView = TextView(this).apply { text = value; setTextColor(color); textSize = size }

    private fun flatPanel(color: Int): android.graphics.drawable.GradientDrawable = android.graphics.drawable.GradientDrawable().apply {
        setColor(color)
        setStroke(dp(1), strokeColor)
        cornerRadius = dp(2).toFloat()
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()
}
