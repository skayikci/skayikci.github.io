---
layout: page
title: Categories
permalink: /categories/
---


<div id="archives">
{% for category in site.categories %}
  <div class="archive-group">
    {% capture category_name %}{{ category | first }}{% endcapture %}
    <div id="#{{ category_name | slugize }}"></div>
    <p></p>

    <h3 class="category-head">{{ category_name }}</h3>
    <a name="{{ category_name | slugize }}"></a>
    {% for post in site.categories[category_name] %}
    <article class="archive-item">
      <h4><a href="{{ site.baseurl }}{{ post.url }}">{{post.title}} 
        <div class="post_date"> <i class='fa fa-calendar'></i> {{post.date | date: "%b %-d, %Y"}} </div>
      </a></h4>
    </article>
    {% endfor %}
  </div>
{% endfor %}
</div>