package com.blackpearl.lab

import android.app.Activity
import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.os.Bundle
import android.text.InputType
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

class FinalActivity : Activity() {
    private val bg = Color.rgb(7, 10, 14)
    private val panel = Color.rgb(14, 19, 25)
    private val panel2 = Color.rgb(18, 24, 31)
    private val line = Color.rgb(38, 48, 60)
    private val cyan = Color.rgb(38, 220, 214)
    private val green = Color.rgb(86, 225, 154)
    private val amber = Color.rgb(244, 190, 74)
    private val red = Color.rgb(244, 92, 92)
    private val text = Color.rgb(235, 240, 245)
    private val muted = Color.rgb(143, 155, 169)
    private lateinit var console: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = bg
        window.navigationBarColor = Color.BLACK
        renderHome()
    }

    override fun onBackPressed() {
        renderHome()
    }

    private fun renderHome() {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(bg)
        }
        root.addView(header())
        val scroll = ScrollView(this)
        val body = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(14), dp(8), dp(14), dp(24))
        }
        body.addView(statusStrip())
        body.addView(section("WORKSPACE"))
        body.addView(module("01", "RECON", "LOCAL ENUMERATION", "DNS / localhost / notes") { recon() })
        body.addView(module("02", "NETWORK", "DEVICE TELEMETRY", "Interfaces / transport / localhost") { network() })
        body.addView(module("03", "WEB", "HTTP INSPECTOR", "Headers / status / localhost") { web() })
        body.addView(module("04", "ANDROID", "POSTURE ANALYSIS", "Build / package / debug state") { androidSecurity() })
        body.addView(module("05", "CRYPTO", "DATA UTILITIES", "SHA-256 / SHA-512 / Base64") { crypto() })
        body.addView(module("06", "CTF LAB", "CONTROLLED PRACTICE", "Local-only challenge workspace") { ctf() })
        body.addView(section("EVIDENCE"))
        body.addView(module("07", "FINDINGS", "CASE TRACKER", "Severity / evidence / status") { findings() })
        body.addView(module("08", "REPORT", "LOCAL EXPORT", "Generate an auditable text report") { report() })
        body.addView(section("LIVE CONSOLE"))
        console = consoleView()
        body.addView(console)
        scroll.addView(body)
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(root)
        log("SYSTEM", "BlackPearl security workstation initialized")
        log("SCOPE", "LOCALHOST ONLY / AUTHORIZED USE")
        log("BUILD", "Android ${Build.VERSION.RELEASE} / API ${Build.VERSION.SDK_INT}")
    }

    private fun header(): View {
        val box = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL; setPadding(dp(14), 0, dp(14), 0); setBackgroundColor(bg) }
        val title = TextView(this).apply { text = "BLACKPEARL"; setTextColor(text); textSize = 21f; typeface = Typeface.create("sans-serif", Typeface.BOLD) }
        box.addView(title, LinearLayout.LayoutParams(0, dp(58), 1f))
        val tag = TextView(this).apply { text = "● SECURE"; setTextColor(green); textSize = 11f; gravity = Gravity.CENTER; typeface = Typeface.DEFAULT_BOLD }
        box.addView(tag, LinearLayout.LayoutParams(dp(88), dp(34)))
        return box
    }

    private fun statusStrip(): View {
        val box = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(dp(14), dp(12), dp(14), dp(12)); setBackgroundColor(panel) }
        val a = TextView(this).apply { text = "SESSION  LOCAL-01"; setTextColor(cyan); textSize = 11f; typeface = Typeface.DEFAULT_BOLD }
        val b = TextView(this).apply { text = "TARGET   127.0.0.1 / ::1"; setTextColor(text); textSize = 13f; setPadding(0, dp(5), 0, 0) }
        val c = TextView(this).apply { text = "MODE     READ-ONLY  •  AUDIT LOG ON"; setTextColor(muted); textSize = 10f; setPadding(0, dp(4), 0, 0) }
        box.addView(a); box.addView(b); box.addView(c)
        return box
    }

    private fun section(s: String): View = TextView(this).apply { text = s; setTextColor(muted); textSize = 10f; typeface = Typeface.DEFAULT_BOLD; setPadding(dp(2), dp(18), 0, dp(8)) }

    private fun module(id: String, name: String, role: String, desc: String, action: () -> Unit): View {
        val box = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL; setPadding(dp(12), dp(10), dp(12), dp(10)); setBackgroundColor(panel) }
        val number = TextView(this).apply { text = id; setTextColor(cyan); textSize = 11f; typeface = Typeface.MONOSPACE; gravity = Gravity.CENTER }
        box.addView(number, LinearLayout.LayoutParams(dp(34), dp(54)))
        val center = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(dp(8), 0, dp(8), 0) }
        val t = TextView(this).apply { text = name; setTextColor(text); textSize = 16f; typeface = Typeface.create("sans-serif", Typeface.BOLD) }
        val r = TextView(this).apply { text = role; setTextColor(cyan); textSize = 9f; typeface = Typeface.DEFAULT_BOLD; setPadding(0, dp(2), 0, 0) }
        val d = TextView(this).apply { text = desc; setTextColor(muted); textSize = 11f; setPadding(0, dp(2), 0, 0) }
        center.addView(t); center.addView(r); center.addView(d)
        box.addView(center, LinearLayout.LayoutParams(0, -2, 1f))
        val arrow = TextView(this).apply { text = ">"; setTextColor(cyan); textSize = 18f; gravity = Gravity.CENTER }
        box.addView(arrow, LinearLayout.LayoutParams(dp(28), dp(54)))
        box.setOnClickListener { action() }
        val wrap = FrameLayout(this); wrap.addView(box, FrameLayout.LayoutParams(-1, -2)); val p = LinearLayout.LayoutParams(-1, -2); p.setMargins(0, 0, 0, dp(5)); wrap.layoutParams = p; return wrap
    }

    private fun screen(title: String, body: LinearLayout) {
        val root = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setBackgroundColor(bg) }
        val bar = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL; setPadding(dp(8), 0, dp(12), 0) }
        val back = TextView(this).apply { text = "‹"; setTextColor(cyan); textSize = 32f; gravity = Gravity.CENTER; setOnClickListener { renderHome() } }
        bar.addView(back, LinearLayout.LayoutParams(dp(46), dp(58)))
        val t = TextView(this).apply { text = title; setTextColor(text); textSize = 18f; typeface = Typeface.DEFAULT_BOLD }
        bar.addView(t, LinearLayout.LayoutParams(0, dp(58), 1f))
        val s = TextView(this).apply { text = "LOCAL"; setTextColor(green); textSize = 9f; gravity = Gravity.CENTER }
        bar.addView(s, LinearLayout.LayoutParams(dp(48), dp(28)))
        root.addView(bar)
        val scroll = ScrollView(this); scroll.addView(body); root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f)); setContentView(root)
    }

    private fun recon() {
        val b = base(); b.addView(h("LOCAL RECON")); b.addView(info("Resolver and inspect local targets. Remote targets are rejected."))
        val host = input("localhost") ; b.addView(host); val out = output(); b.addView(out)
        b.addView(action("RESOLVE") { val h = host.text.toString().trim().ifEmpty { "localhost" }; if (!allowed(h)) out.text = "BLOCKED\nLOCALHOST ONLY" else Thread { try { val a = InetAddress.getAllByName(h); val r = a.joinToString("\n") { "${it.hostName}  ->  ${it.hostAddress}" }; runOnUiThread { out.text = r; log("RECON", "Resolved $h") } } catch (e: Exception) { runOnUiThread { out.text = "ERROR\n${e.message}" } } }.start() })
        screen("RECON", b)
    }

    private fun network() {
        val b = base(); b.addView(h("DEVICE NETWORK")); b.addView(info("Read-only connectivity telemetry and localhost checks.")); val out = output(); b.addView(out); out.text = networkStatus()
        b.addView(action("REFRESH") { out.text = networkStatus(); log("NETWORK", "Connectivity telemetry refreshed") })
        b.addView(action("PROBE 127.0.0.1:8080") { Thread { val ok = try { Socket().apply { connect(InetSocketAddress("127.0.0.1", 8080), 1000); close() }; true } catch (_: Exception) { false }; runOnUiThread { out.text = "TARGET  127.0.0.1:8080\nSTATE   ${if (ok) "OPEN" else "CLOSED / UNREACHABLE"}"; log("NETWORK", "localhost:8080 = ${if (ok) "OPEN" else "CLOSED"}") } }.start() })
        screen("NETWORK", b)
    }

    private fun networkStatus(): String {
        val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val n = cm.activeNetwork; val c = if (n != null) cm.getNetworkCapabilities(n) else null
        val transport = when { c?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true -> "WIFI"; c?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true -> "CELLULAR"; c?.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) == true -> "ETHERNET"; else -> "OFFLINE" }
        return "TRANSPORT  $transport\nVALIDATED  ${if (c?.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED) == true) "YES" else "NO / UNKNOWN"}\nANDROID    ${Build.VERSION.RELEASE} / API ${Build.VERSION.SDK_INT}\nDEVICE     ${Build.MANUFACTURER} ${Build.MODEL}"
    }

    private fun web() { val b = base(); b.addView(h("HTTP INSPECTOR")); b.addView(info("HEAD request only. Host must resolve to localhost.")); val u = input("http://127.0.0.1:8080/"); b.addView(u); val o = output(); b.addView(o); b.addView(action("INSPECT") { val raw = u.text.toString().trim(); if (!raw.contains("127.0.0.1") && !raw.contains("localhost") && !raw.contains("[::1]")) { o.text = "BLOCKED\nLOCALHOST ONLY"; return@action }; Thread { try { val c = java.net.URL(raw).openConnection() as java.net.HttpURLConnection; c.requestMethod = "HEAD"; c.connectTimeout = 2500; c.readTimeout = 2500; c.connect(); val s = "HTTP ${c.responseCode} ${c.responseMessage}\n\n" + c.headerFields.filterKeys { it != null }.entries.joinToString("\n") { "${it.key}: ${it.value.joinToString(", ")}" }; c.disconnect(); runOnUiThread { o.text = s; log("WEB", "Inspected $raw") } } catch (e: Exception) { runOnUiThread { o.text = "ERROR\n${e.message}" } } }.start() }); screen("WEB", b) }

    private fun androidSecurity() { val b = base(); b.addView(h("ANDROID POSTURE")); b.addView(info("Local device posture only. No bypass or escalation operations.")); val o = output(); o.text = "PACKAGE     $packageName\nDEVICE      ${Build.MANUFACTURER} ${Build.MODEL}\nANDROID     ${Build.VERSION.RELEASE}\nAPI         ${Build.VERSION.SDK_INT}\nDEBUGGABLE  ${(applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0}\nUID         ${applicationInfo.uid}"; b.addView(o); b.addView(action("RECHECK") { o.text = o.text }); screen("ANDROID", b) }

    private fun crypto() { val b = base(); b.addView(h("CRYPTO TOOLKIT")); val i = input("Input"); i.inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_MULTI_LINE; b.addView(i); val o = output(); b.addView(o); b.addView(action("SHA-256") { o.text = digest(i.text.toString(), "SHA-256") }); b.addView(action("SHA-512") { o.text = digest(i.text.toString(), "SHA-512") }); b.addView(action("BASE64 ENCODE") { o.text = Base64.encodeToString(i.text.toString().toByteArray(), Base64.NO_WRAP) }); b.addView(action("BASE64 DECODE") { o.text = try { String(Base64.decode(i.text.toString(), Base64.DEFAULT)) } catch (_: Exception) { "INVALID BASE64" } }); screen("CRYPTO", b) }
    private fun ctf() { val b = base(); b.addView(h("CONTROLLED CTF LAB")); b.addView(info("Practice challenges are intentionally local and non-destructive.")); b.addView(code("CHALLENGE 01\nFind the SHA-256 digest of: BLACKPEARL")); b.addView(action("GENERATE ANSWER") { b.addView(code("ANSWER\n${digest("BLACKPEARL", "SHA-256")}")) }); screen("CTF LAB", b) }
    private fun findings() { val b = base(); b.addView(h("FINDINGS TRACKER")); b.addView(info("Persistent local evidence belongs here. No external submission is performed.")); b.addView(code("NO ACTIVE FINDINGS\n\nUse this workspace to record observations from authorized local testing.")); screen("FINDINGS", b) }
    private fun report() { val b = base(); b.addView(h("LOCAL REPORT")); b.addView(info("Generates a local text summary. Nothing is uploaded.")); val o = output(); b.addView(o); b.addView(action("GENERATE REPORT") { o.text = "BLACKPEARL SECURITY REPORT\n${SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date())}\n\nSCOPE: LOCALHOST ONLY\nDEVICE: ${Build.MANUFACTURER} ${Build.MODEL}\nANDROID: ${Build.VERSION.RELEASE} / API ${Build.VERSION.SDK_INT}\n\nSTATUS: READY FOR AUTHORIZED LOCAL TESTING"; log("REPORT", "Local report generated") }); screen("REPORT", b) }

    private fun base() = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(dp(14), dp(8), dp(14), dp(28)) }
    private fun h(s: String) = TextView(this).apply { text = s; setTextColor(text); textSize = 18f; typeface = Typeface.DEFAULT_BOLD; setPadding(0, dp(8), 0, dp(8)) }
    private fun info(s: String) = TextView(this).apply { text = s; setTextColor(muted); textSize = 12f; setPadding(0, 0, 0, dp(12)) }
    private fun code(s: String) = TextView(this).apply { text = s; setTextColor(Color.rgb(180, 230, 220)); textSize = 12f; typeface = Typeface.MONOSPACE; setPadding(dp(12), dp(12), dp(12), dp(12)); setBackgroundColor(panel) }
    private fun input(hint: String) = EditText(this).apply { this.hint = hint; setTextColor(text); setHintTextColor(muted); textSize = 13f; setSingleLine(false); setPadding(dp(12), dp(10), dp(12), dp(10)); setBackgroundColor(panel2) }
    private fun output() = TextView(this).apply { setTextColor(text); textSize = 12f; typeface = Typeface.MONOSPACE; setPadding(dp(12), dp(12), dp(12), dp(12)); setBackgroundColor(panel); minHeight = dp(90) }
    private fun action(label: String, f: () -> Unit) = Button(this).apply { text = label; setTextColor(cyan); textSize = 11f; typeface = Typeface.DEFAULT_BOLD; setOnClickListener { f() } }
    private fun consoleView() = TextView(this).apply { setTextColor(Color.rgb(150, 230, 190)); textSize = 10f; typeface = Typeface.MONOSPACE; setPadding(dp(10), dp(10), dp(10), dp(10)); setBackgroundColor(Color.rgb(4, 7, 10)); minHeight = dp(120) }
    private fun log(tag: String, msg: String) { if (::console.isInitialized) { val ts = SimpleDateFormat("HH:mm:ss", Locale.US).format(Date()); console.append("[$ts] $tag  $msg\n") } }
    private fun digest(v: String, a: String) = MessageDigest.getInstance(a).digest(v.toByteArray()).joinToString("") { "%02x".format(it) }
    private fun allowed(h: String) = h == "localhost" || h == "127.0.0.1" || h == "::1"
    private fun dp(v: Int) = (v * resources.displayMetrics.density).toInt()
}
